"""
Create and store embeddings in Qdrant vector database
"""
import json
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer
from qdrant_client.models import PointStruct
from tqdm import tqdm

from qdrant_config import (
    get_qdrant_client,
    ensure_collection_exists,
    COLLECTION_NAME,
    EMBEDDING_DIMENSION
)

def create_qdrant_embeddings(batch_size=100):
    """
    Create embeddings and store them in Qdrant.
    
    This function:
    1. Loads parsed chunks from JSON
    2. Creates embeddings using Sentence Transformers
    3. Uploads embeddings to Qdrant with metadata
    
    Args:
        batch_size: Number of points to upload in each batch
    
    Returns:
        bool: True if successful
    """
    print("=" * 80)
    print("🚀 Creating Qdrant Embeddings")
    print("=" * 80)
    
    # Load chunks
    print("\n📂 Loading parsed chunks...")
    try:
        with open("parsed_content/parsed_chunks.json", 'r', encoding='utf-8') as f:
            chunks = json.load(f)
        print(f"✅ Loaded {len(chunks)} chunks")
    except FileNotFoundError:
        print("❌ Error: parsed_content/parsed_chunks.json not found")
        print("💡 Run the PDF parsing script first to create chunks")
        return False
    
    if not chunks:
        print("❌ No chunks found to process")
        return False
    
    # Initialize Qdrant client
    print("\n🔌 Connecting to Qdrant...")
    try:
        client = get_qdrant_client()
    except Exception as e:
        print(f"❌ Failed to connect to Qdrant: {e}")
        return False
    
    # Ensure collection exists
    print(f"\n📚 Setting up collection '{COLLECTION_NAME}'...")
    try:
        ensure_collection_exists(client, COLLECTION_NAME, EMBEDDING_DIMENSION)
    except Exception as e:
        print(f"❌ Failed to setup collection: {e}")
        return False
    
    # Initialize embedding model
    print("\n🧠 Loading Sentence Transformer model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("✅ Model loaded successfully!")
    
    # Prepare texts for embedding
    print("\n📝 Preparing texts...")
    texts = []
    for chunk in chunks:
        text = chunk.get('text', '').strip()
        if text:
            texts.append(text)
        else:
            texts.append("")  # Keep index alignment
    
    print(f"✅ Prepared {len(texts)} texts")
    
    # Create embeddings
    print("\n🔮 Creating embeddings...")
    embeddings = model.encode(
        texts,
        show_progress_bar=True,
        batch_size=32,
        convert_to_numpy=True
    )
    print(f"✅ Created embeddings with shape: {embeddings.shape}")
    
    # Prepare points for Qdrant
    print("\n📦 Preparing points for upload...")
    points = []
    
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        # Create payload with metadata
        payload = {
            "chunk_id": chunk.get("chunk_id", f"chunk_{i}"),
            "text": chunk.get("text", ""),
            "preview": chunk.get("preview", ""),
            "token_count": chunk.get("token_count", 0),
            "source_file": chunk.get("source_file", "unknown"),
            "page_number": chunk.get("page_number", 0),
            "chunk_index": i
        }
        
        # Create point
        point = PointStruct(
            id=i,
            vector=embedding.tolist(),
            payload=payload
        )
        points.append(point)
    
    print(f"✅ Prepared {len(points)} points")
    
    # Upload to Qdrant in batches
    print(f"\n⬆️ Uploading to Qdrant (batch size: {batch_size})...")
    try:
        for i in tqdm(range(0, len(points), batch_size), desc="Uploading batches"):
            batch = points[i:i + batch_size]
            client.upsert(
                collection_name=COLLECTION_NAME,
                points=batch
            )
        
        print(f"✅ Successfully uploaded {len(points)} points to Qdrant")
    
    except Exception as e:
        print(f"❌ Error uploading to Qdrant: {e}")
        return False
    
    # Verify upload
    print("\n🔍 Verifying upload...")
    try:
        collection_info = client.get_collection(COLLECTION_NAME)
        print(f"✅ Collection stats:")
        print(f"   - Points count: {collection_info.points_count}")
        print(f"   - Vectors count: {collection_info.vectors_count}")
        print(f"   - Status: {collection_info.status}")
    except Exception as e:
        print(f"⚠️ Warning: Could not verify upload: {e}")
    
    # Save summary
    print("\n💾 Saving summary...")
    summary = {
        "collection_name": COLLECTION_NAME,
        "total_chunks": len(chunks),
        "embedding_dimension": EMBEDDING_DIMENSION,
        "model_name": "all-MiniLM-L6-v2",
        "method": "SentenceTransformer + Qdrant",
        "similarity_metric": "cosine",
        "points_uploaded": len(points)
    }
    
    try:
        with open("parsed_content/qdrant_summary.json", 'w') as f:
            json.dump(summary, f, indent=2)
        print("✅ Summary saved to: parsed_content/qdrant_summary.json")
    except Exception as e:
        print(f"⚠️ Warning: Could not save summary: {e}")
    
    print("\n" + "=" * 80)
    print("✅ Qdrant embeddings created successfully!")
    print("=" * 80)
    print(f"📊 Summary:")
    print(f"   - Collection: {COLLECTION_NAME}")
    print(f"   - Points: {len(points)}")
    print(f"   - Dimension: {EMBEDDING_DIMENSION}")
    print(f"   - Model: all-MiniLM-L6-v2")
    print("=" * 80)
    
    return True

if __name__ == "__main__":
    success = create_qdrant_embeddings()
    if not success:
        print("\n❌ Failed to create Qdrant embeddings")
        exit(1)
    else:
        print("\n✅ All done!")
