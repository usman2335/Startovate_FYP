"""
Migrate existing Sentence Transformer embeddings to Qdrant
Loads pre-computed embeddings from .npy and .pkl files and uploads to Qdrant
"""
import json
import pickle
import numpy as np
from pathlib import Path
from qdrant_client.models import PointStruct
from tqdm import tqdm

from qdrant_config import (
    get_qdrant_client,
    ensure_collection_exists,
    COLLECTION_NAME,
    EMBEDDING_DIMENSION
)

def migrate_existing_embeddings(reset_collection=False, batch_size=100):
    """
    Migrate existing Sentence Transformer embeddings to Qdrant.
    
    Loads embeddings from:
    - parsed_content/sentence_transformer_embeddings.npy
    - parsed_content/sentence_transformer_metadata.pkl
    
    Args:
        reset_collection: If True, delete existing collection before migrating
        batch_size: Number of points to upload in each batch
    
    Returns:
        bool: True if successful
    """
    print("=" * 80)
    print("🔄 Migrating Existing Embeddings to Qdrant")
    print("=" * 80)
    
    # Load embeddings and metadata
    embeddings_path = Path("parsed_content/sentence_transformer_embeddings.npy")
    metadata_path = Path("parsed_content/sentence_transformer_metadata.pkl")
    
    print("\n📂 Loading existing embeddings...")
    try:
        embeddings = np.load(embeddings_path)
        print(f"✅ Loaded embeddings: shape {embeddings.shape}")
    except FileNotFoundError:
        print(f"❌ Error: {embeddings_path} not found")
        return False
    except Exception as e:
        print(f"❌ Error loading embeddings: {e}")
        return False
    
    print("\n📂 Loading metadata...")
    try:
        with open(metadata_path, 'rb') as f:
            metadata = pickle.load(f)
        print(f"✅ Loaded metadata: {len(metadata)} chunks")
    except FileNotFoundError:
        print(f"❌ Error: {metadata_path} not found")
        return False
    except Exception as e:
        print(f"❌ Error loading metadata: {e}")
        return False
    
    # Validate data
    if len(embeddings) != len(metadata):
        print(f"❌ Error: Mismatch between embeddings ({len(embeddings)}) and metadata ({len(metadata)})")
        return False
    
    if embeddings.shape[1] != EMBEDDING_DIMENSION:
        print(f"⚠️ Warning: Embedding dimension mismatch. Expected {EMBEDDING_DIMENSION}, got {embeddings.shape[1]}")
        print("   This might cause issues. Continuing anyway...")
    
    # Connect to Qdrant
    print("\n🔌 Connecting to Qdrant...")
    try:
        client = get_qdrant_client()
    except Exception as e:
        print(f"❌ Failed to connect to Qdrant: {e}")
        return False
    
    # Handle collection reset if requested
    if reset_collection:
        print(f"\n🗑️ Resetting collection '{COLLECTION_NAME}'...")
        try:
            collections = client.get_collections()
            collection_names = [col.name for col in collections.collections]
            if COLLECTION_NAME in collection_names:
                client.delete_collection(COLLECTION_NAME)
                print(f"✅ Deleted existing collection")
        except Exception as e:
            print(f"⚠️ Warning: Could not delete collection: {e}")
    
    # Ensure collection exists
    print(f"\n📚 Setting up collection '{COLLECTION_NAME}'...")
    try:
        ensure_collection_exists(client, COLLECTION_NAME, EMBEDDING_DIMENSION)
    except Exception as e:
        print(f"❌ Failed to setup collection: {e}")
        return False
    
    # Prepare points for Qdrant
    print("\n📦 Preparing points for upload...")
    points = []
    
    for i, (embedding, chunk_meta) in enumerate(zip(embeddings, metadata)):
        # Extract metadata from chunk
        # Handle different metadata formats
        if isinstance(chunk_meta, dict):
            chunk_id = chunk_meta.get("chunk_id", f"chunk_{i}")
            text = chunk_meta.get("text", "")
            preview = chunk_meta.get("preview", text[:100] if text else "")
            token_count = chunk_meta.get("token_count", 0)
            source_file = chunk_meta.get("source_file", "unknown")
            page_number = chunk_meta.get("page_number", 0)
        else:
            # Fallback if metadata format is different
            chunk_id = f"chunk_{i}"
            text = str(chunk_meta) if chunk_meta else ""
            preview = text[:100] if text else ""
            token_count = 0
            source_file = "unknown"
            page_number = 0
        
        # Create payload with metadata
        payload = {
            "chunk_id": chunk_id,
            "text": text,
            "preview": preview,
            "token_count": token_count,
            "source_file": source_file,
            "page_number": page_number,
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
        import traceback
        print(traceback.format_exc())
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
    
    # Save migration summary
    print("\n💾 Saving migration summary...")
    summary = {
        "collection_name": COLLECTION_NAME,
        "total_chunks": len(points),
        "embedding_dimension": EMBEDDING_DIMENSION,
        "model_name": "all-MiniLM-L6-v2",
        "method": "Migration from SentenceTransformer",
        "similarity_metric": "cosine",
        "points_uploaded": len(points),
        "source_files": {
            "embeddings": str(embeddings_path),
            "metadata": str(metadata_path)
        }
    }
    
    try:
        summary_path = Path("parsed_content/qdrant_migration_summary.json")
        with open(summary_path, 'w') as f:
            json.dump(summary, f, indent=2)
        print(f"✅ Summary saved to: {summary_path}")
    except Exception as e:
        print(f"⚠️ Warning: Could not save summary: {e}")
    
    print("\n" + "=" * 80)
    print("✅ Migration completed successfully!")
    print("=" * 80)
    print(f"📊 Summary:")
    print(f"   - Collection: {COLLECTION_NAME}")
    print(f"   - Points: {len(points)}")
    print(f"   - Dimension: {EMBEDDING_DIMENSION}")
    print(f"   - Model: all-MiniLM-L6-v2")
    print("=" * 80)
    
    return True

if __name__ == "__main__":
    success = migrate_existing_embeddings(reset_collection=True, batch_size=100)
    if not success:
        print("\n❌ Migration failed")
        exit(1)
    else:
        print("\n✅ All done!")

