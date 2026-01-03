"""
Automatic setup for LCI ChatBot embeddings
Runs on first startup to initialize Qdrant with embeddings
"""
import os
import sys
import json
import pickle
import numpy as np
from pathlib import Path

def check_embeddings_exist():
    """Check if embeddings are already loaded in Qdrant"""
    try:
        from qdrant_config import get_qdrant_client, COLLECTION_NAME
        client = get_qdrant_client()
        
        # Check if collection exists and has points
        collections = client.get_collections()
        collection_names = [col.name for col in collections.collections]
        
        if COLLECTION_NAME not in collection_names:
            return False
            
        collection_info = client.get_collection(COLLECTION_NAME)
        return collection_info.points_count > 0
        
    except Exception as e:
        print(f"⚠️ Could not check Qdrant status: {e}")
        return False

def auto_setup_embeddings():
    """Automatically set up embeddings if they don't exist"""
    print("🔍 Checking if embeddings are already set up...")
    
    if check_embeddings_exist():
        print("✅ Embeddings already exist in Qdrant - skipping setup")
        return True
    
    print("📦 No embeddings found - setting up automatically...")
    
    # Check if source files exist
    embeddings_file = Path("parsed_content/sentence_transformer_embeddings.npy")
    metadata_file = Path("parsed_content/sentence_transformer_metadata.pkl")
    
    if not embeddings_file.exists() or not metadata_file.exists():
        print("❌ Source embedding files not found!")
        print("💡 Expected files:")
        print(f"   - {embeddings_file}")
        print(f"   - {metadata_file}")
        return False
    
    print("📂 Found source embedding files - loading...")
    
    try:
        # Import migration function
        from migrate_to_qdrant import migrate_existing_embeddings
        
        print("🔄 Running automatic migration...")
        success = migrate_existing_embeddings(reset_collection=True, batch_size=100)
        
        if success:
            print("✅ Embeddings automatically set up successfully!")
            return True
        else:
            print("❌ Automatic setup failed")
            return False
            
    except ImportError:
        print("❌ Migration module not found")
        return False
    except Exception as e:
        print(f"❌ Error during automatic setup: {e}")
        return False

def ensure_qdrant_running():
    """Ensure Qdrant server is running"""
    try:
        from qdrant_config import get_qdrant_client
        client = get_qdrant_client()
        print("✅ Qdrant server is running")
        return True
    except Exception as e:
        print(f"❌ Qdrant server not accessible: {e}")
        print("💡 Make sure to start Qdrant server first:")
        print("   cd qdrant_local")
        print("   ./qdrant.exe --config-path config.yaml")
        return False

def run_auto_setup():
    """Main auto-setup function"""
    print("=" * 60)
    print("🚀 LCI ChatBot Auto-Setup")
    print("=" * 60)
    
    # Step 1: Check Qdrant server
    if not ensure_qdrant_running():
        return False
    
    # Step 2: Set up embeddings if needed
    if not auto_setup_embeddings():
        return False
    
    print("=" * 60)
    print("✅ Auto-setup completed successfully!")
    print("🎉 ChatBot is ready to use with LCI knowledge base")
    print("=" * 60)
    return True

if __name__ == "__main__":
    success = run_auto_setup()
    sys.exit(0 if success else 1)