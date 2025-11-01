"""
Create vector embeddings using Sentence Transformers
"""

import json
import numpy as np
import pickle
import os
import re
from pathlib import Path

# Try to import sentence transformers
try:
    from sentence_transformers import SentenceTransformer
    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError:
    SENTENCE_TRANSFORMERS_AVAILABLE = False
    print("Error: sentence-transformers not available. Install with: pip install sentence-transformers")

def create_sentence_transformer_embeddings():
    """
    Create vector embeddings using Sentence Transformers.
    """
    
    print("Creating Sentence Transformer embeddings...")
    
    if not SENTENCE_TRANSFORMERS_AVAILABLE:
        print("Error: sentence-transformers is required")
        return False
    
    # Load the chunks
    chunks_file = "parsed_content/LCI_BOOK_SLIDING_CHUNKS.json"
    if not os.path.exists(chunks_file):
        print(f"Error: {chunks_file} not found!")
        return False
    
    with open(chunks_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    chunks = data['chunks']
    print(f"Loaded {len(chunks)} chunks")
    
    # Initialize the embedding model
    print("Loading Sentence Transformer model...")
    # Using a lightweight, fast model that works well for semantic search
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("Model loaded successfully!")
    
    # Extract texts for embedding
    texts = [chunk['text'] for chunk in chunks]
    
    # Clean texts
    cleaned_texts = []
    for text in texts:
        # Remove extra whitespace and normalize
        cleaned = re.sub(r'\s+', ' ', text.strip())
        cleaned_texts.append(cleaned)
    
    print(f"Creating embeddings for {len(cleaned_texts)} texts...")
    
    # Create embeddings
    embeddings = model.encode(cleaned_texts, show_progress_bar=True, batch_size=32)
    print(f"Created embeddings with shape: {embeddings.shape}")
    
    # Create metadata for each vector
    metadata = []
    for i, chunk in enumerate(chunks):
        metadata.append({
            'chunk_id': chunk['chunk_id'],
            'text': chunk['text'],
            'token_count': chunk['token_count'],
            'char_count': chunk['char_count'],
            'preview': chunk['preview'],
            'chunk_size_category': chunk['chunk_size_category'],
            'estimated_pages': chunk['estimated_pages'],
            'has_table': chunk['has_table'],
            'has_definition': chunk['has_definition'],
            'has_example': chunk['has_example'],
            'has_chapter': chunk['has_chapter'],
            'has_numbered_list': chunk['has_numbered_list']
        })
    
    # Save embeddings
    np.save("parsed_content/sentence_transformer_embeddings.npy", embeddings)
    print("Sentence Transformer embeddings saved to: parsed_content/sentence_transformer_embeddings.npy")
    
    # Save model info
    model_info = {
        'model_name': 'all-MiniLM-L6-v2',
        'embedding_dimension': embeddings.shape[1],
        'total_chunks': len(chunks)
    }
    
    with open("parsed_content/sentence_transformer_model_info.pkl", 'wb') as f:
        pickle.dump(model_info, f)
    print("Model info saved to: parsed_content/sentence_transformer_model_info.pkl")
    
    # Save metadata
    with open("parsed_content/sentence_transformer_metadata.pkl", 'wb') as f:
        pickle.dump(metadata, f)
    print("Metadata saved to: parsed_content/sentence_transformer_metadata.pkl")
    
    # Create embeddings summary
    embeddings_summary = {
        'total_chunks': len(chunks),
        'embedding_dimension': embeddings.shape[1],
        'model_name': 'all-MiniLM-L6-v2',
        'method': 'SentenceTransformer',
        'similarity_metric': 'cosine',
        'files_created': [
            'sentence_transformer_embeddings.npy',
            'sentence_transformer_model_info.pkl',
            'sentence_transformer_metadata.pkl',
            'sentence_transformer_summary.json'
        ]
    }
    
    # Save summary
    with open("parsed_content/sentence_transformer_summary.json", 'w') as f:
        json.dump(embeddings_summary, f, indent=2)
    print("Summary saved to: parsed_content/sentence_transformer_summary.json")
    
    print("\n✅ Sentence Transformer vector database created successfully!")
    print("Files created:")
    print("  - sentence_transformer_embeddings.npy (embeddings)")
    print("  - sentence_transformer_model_info.pkl (model info)")
    print("  - sentence_transformer_metadata.pkl (chunk metadata)")
    print("  - sentence_transformer_summary.json (summary)")
    
    return True

def test_sentence_transformer_search():
    """
    Test the Sentence Transformer search functionality.
    """
    
    print("\nTesting Sentence Transformer search...")
    
    if not SENTENCE_TRANSFORMERS_AVAILABLE:
        print("Error: sentence-transformers not available")
        return False
    
    try:
        from sentence_transformers import SentenceTransformer
        from sklearn.metrics.pairwise import cosine_similarity
        
        # Load embeddings and metadata
        embeddings = np.load("parsed_content/sentence_transformer_embeddings.npy")
        
        with open("parsed_content/sentence_transformer_metadata.pkl", 'rb') as f:
            metadata = pickle.load(f)
        
        print(f"Loaded embeddings with shape: {embeddings.shape}")
        print(f"Loaded metadata for {len(metadata)} chunks")
        
        # Load model
        model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Test search
        query = "What is the Lean Canvas for Invention?"
        print(f"\nTest query: '{query}'")
        
        # Encode query
        query_embedding = model.encode([query])
        
        # Calculate cosine similarities
        similarities = cosine_similarity(query_embedding, embeddings).flatten()
        
        # Get top 5 results
        top_indices = np.argsort(similarities)[::-1][:5]
        
        print(f"\nTop 5 results:")
        for i, idx in enumerate(top_indices):
            chunk = metadata[idx]
            similarity = similarities[idx]
            print(f"\n{i+1}. Similarity: {similarity:.4f}")
            print(f"   Chunk ID: {chunk['chunk_id']}")
            print(f"   Preview: {chunk['preview'][:100]}...")
            print(f"   Tokens: {chunk['token_count']}")
        
        print("\n✅ Sentence Transformer search test completed!")
        return True
        
    except Exception as e:
        print(f"❌ Error testing search: {e}")
        return False

def create_sentence_transformer_search_function():
    """
    Create a search function for Sentence Transformers.
    """
    
    search_code = '''
def search_chunks_sentence_transformer(query, top_k=5):
    """
    Search for relevant chunks using Sentence Transformers and cosine similarity.
    
    Args:
        query (str): Search query
        top_k (int): Number of top results to return
    
    Returns:
        list: List of relevant chunks with similarity scores
    """
    import numpy as np
    import pickle
    from sentence_transformers import SentenceTransformer
    from sklearn.metrics.pairwise import cosine_similarity
    
    # Load embeddings and metadata
    embeddings = np.load("parsed_content/sentence_transformer_embeddings.npy")
    
    with open("parsed_content/sentence_transformer_metadata.pkl", 'rb') as f:
        metadata = pickle.load(f)
    
    # Load model
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # Encode query
    query_embedding = model.encode([query])
    
    # Calculate similarities
    similarities = cosine_similarity(query_embedding, embeddings).flatten()
    
    # Get top results
    top_indices = np.argsort(similarities)[::-1][:top_k]
    
    results = []
    for idx in top_indices:
        chunk = metadata[idx]
        results.append({
            'chunk_id': chunk['chunk_id'],
            'text': chunk['text'],
            'similarity': float(similarities[idx]),
            'preview': chunk['preview'],
            'token_count': chunk['token_count']
        })
    
    return results
'''
    
    with open("parsed_content/sentence_transformer_search_function.py", 'w') as f:
        f.write(search_code)
    
    print("Sentence Transformer search function saved to: parsed_content/sentence_transformer_search_function.py")

if __name__ == "__main__":
    print("Sentence Transformer Vector Database Creation")
    print("=" * 50)
    
    # Check if chunks exist
    if not os.path.exists("parsed_content/LCI_BOOK_SLIDING_CHUNKS.json"):
        print("Error: LCI_BOOK_SLIDING_CHUNKS.json not found!")
        print("Please run create_sliding_chunks.py first.")
        exit(1)
    
    # Create embeddings
    success = create_sentence_transformer_embeddings()
    
    if success:
        # Test search
        test_sentence_transformer_search()
        
        # Create search function
        create_sentence_transformer_search_function()
        
        print("\n🎉 Sentence Transformer vector database setup complete!")
        print("\nNext steps:")
        print("1. Use the search function for semantic search in your chatbot")
        print("2. The embeddings are ready for RAG (Retrieval-Augmented Generation)")
        print("3. Import sentence_transformer_search_function.py in your chatbot code")
    else:
        print("\n❌ Vector database creation failed!")
        print("Please install sentence-transformers and try again.")
