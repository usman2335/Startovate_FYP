"""
Migration script to move existing embeddings to Qdrant
"""
import json
import pickle
import numpy as np
from qdrant_client.models import PointStruct
from tqdm import tqdm

from qdrant_config import (
    get_qdrant_client,
    ensure_collection_exists,
    delete_collection,
    COLLECTION_NAME,
    EMBEDDING_DIMENSION
)

def migrate_existing_embeddings(reset_collection=False, batch_size=100):
    """
    Migrate existing numpy embeddings to Qdrant.
    
    This script:
    1. Loads existing embeddings from .npy file
    2. Loads metadata from .pkl file
    3. Uploads everything to Qdrant
    
    Args:
        reset_collection: If True, delete and recreate the collection
        batch_size: Number of points to upload in each batch
    
    Returns:
        bool: True if successful
    """
    print("=" * 80)
    print("🔄 Migrating Embeddings to Qdrant")
    print("=" * 80)
    
    # Load existing embeddings
    print("\n📂 Loading existing embeddings...")
    try:
        embeddings = np.load("parsed_content/sentence_transformer_embeddings.npy")
        print(f"✅ Loaded embeddings with shape: {embeddings.shape}")
    except FileNotFoundError:
        print("❌ Error: sentence_transformer_embeddings.npy not found")
        print("💡 Run create_sentence_transformer_embeddings.py first")
        return False
    
    # Load metadata
    print("\n📂 Loading metadata...")
    try:
        with open("parsed_content/sentence_transformer_metadata.pkl", 'rb') as f:
            metadata = pickle.load(f)
        print(f"✅ Loaded metadata for {len(metadata)} chunks")
    except FileNotFoundError:
        print("❌ Error: sentence_transformer_metadata.pkl not found")
        return False
    
    # Verify data consistency
    if len(embeddings) != len(metadata):
        print(f"⚠️ Warning: Embeddings count ({len(embeddings)}) != Metadata count ({len(metadata)})")
        print("Using minimum count...")
        min_count = min(len(embeddings), len(metadata))
        embeddings = embeddings[:min_count]
        metadata = metadata[:min_count]
    
    # Connect to Qdrant
    print("\n🔌 Connecting to Qdrant...")
    try:
        client = get_qdrant_client()
    except Exception as e:
        print(f"❌ Failed to connect to Qdrant: {e}")
        return False
    
    # Handle collection reset
    if reset_collection:
        print(f"\n🗑️ Resetting collection '{COLLECTION_NAME}'...")
        try:
            delete_collection(client, COLLECTION_NAME)
        except Exception as e:
            print(f"⚠️ Warning: Could not delete collection: {e}")
    
    # Ensure collection exists
    print(f"\n📚 Setting up collection '{COLLECTION_NAME}'...")
    try:
        ensure_collection_exists(client, COLLECTION_NAME, EMBEDDING_DIMENSION)
    except Exception as e:
        print(f"❌ Failed to setup collection: {e}")
        return False
    
    # Prepare points
    print("\n📦 Preparing points for upload...")
    points = []
    
    for i, (embedding, meta) in enumerate(zip(embeddings, metadata)):
        # Create payload
        payload = {
            "chunk_id": meta.get("chunk_id", f"chunk_{i}"),
            "text": meta.get("text", ""),
            "preview": meta.get("preview", ""),
            "token_count": meta.get("token_count", 0),
            "source_file": meta.get("source_file", "unknown"),
            "page_number": meta.get("page_number", 0),
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
    
    # Save migration summary
    print("\n💾 Saving migration summary...")
    summary = {
        "migration_status": "completed",
        "collection_name": COLLECTION_NAME,
        "points_migrated": len(points),
        "embedding_dimension": EMBEDDING_DIMENSION,
        "source_files": [
            "sentence_transformer_embeddings.npy",
            "sentence_transformer_metadata.pkl"
        ]
    }
    
    try:
        with open("parsed_content/qdrant_migration_summary.json", 'w') as f:
            json.dump(summary, f, indent=2)
        print("✅ Summary saved to: parsed_content/qdrant_migration_summary.json")
    except Exception as e:
        print(f"⚠️ Warning: Could not save summary: {e}")
    
    print("\n" + "=" * 80)
    print("✅ Migration completed successfully!")
    print("=" * 80)
    print(f"📊 Summary:")
    print(f"   - Collection: {COLLECTION_NAME}")
    print(f"   - Points migrated: {len(points)}")
    print(f"   - Dimension: {EMBEDDING_DIMENSION}")
    print("=" * 80)
    print("\n💡 Next steps:")
    print("   1. Test the search: python test_qdrant_search.py")
    print("   2. Update main.py to use qdrant_search.py")
    print("   3. (Optional) Delete old files: sentence_transformer_embeddings.npy, etc.")
    print("=" * 80)
    
    return True

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Migrate embeddings to Qdrant")
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Delete and recreate the collection before migration"
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=100,
        help="Batch size for uploading (default: 100)"
    )
    
    args = parser.parse_args()
    
    success = migrate_existing_embeddings(
        reset_collection=args.reset,
        batch_size=args.batch_size
    )
    
    if not success:
        print("\n❌ Migration failed")
        exit(1)
    else:
        print("\n✅ All done!")
