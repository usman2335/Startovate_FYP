
def search_chunks_sentence_transformer(query, top_k=3):
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
