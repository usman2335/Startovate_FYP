"""
Qdrant Configuration and Client Setup
"""
import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

load_dotenv()

# Qdrant Configuration
QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", "6333"))
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", None)  # For Qdrant Cloud
QDRANT_URL = os.getenv("QDRANT_URL", None)  # For Qdrant Cloud

# Collection Configuration
COLLECTION_NAME = os.getenv("QDRANT_COLLECTION_NAME", "lci_knowledge_base")
EMBEDDING_DIMENSION = 384  # all-MiniLM-L6-v2 dimension

def get_qdrant_client():
    """
    Initialize and return a Qdrant client.
    
    Supports both local and cloud deployments:
    - Local: Uses QDRANT_HOST and QDRANT_PORT
    - Cloud: Uses QDRANT_URL and QDRANT_API_KEY
    
    Returns:
        QdrantClient: Configured Qdrant client
    """
    try:
        if QDRANT_URL and QDRANT_URL.strip():
            # Cloud deployment
            print(f"🌐 Connecting to Qdrant Cloud: {QDRANT_URL}")
            client = QdrantClient(
                url=QDRANT_URL,
                api_key=QDRANT_API_KEY,
                timeout=30
            )
        else:
            # Local deployment
            print(f"🏠 Connecting to local Qdrant: {QDRANT_HOST}:{QDRANT_PORT}")
            client = QdrantClient(
                host=QDRANT_HOST,
                port=QDRANT_PORT,
                timeout=30
            )
        
        # Test connection
        collections = client.get_collections()
        print(f"✅ Successfully connected to Qdrant")
        print(f"📚 Available collections: {len(collections.collections)}")
        
        return client
    
    except Exception as e:
        print(f"❌ Failed to connect to Qdrant: {e}")
        print("\n💡 Tips:")
        print("   - For local: Make sure Qdrant is running (docker run -p 6333:6333 qdrant/qdrant)")
        print("   - For cloud: Set QDRANT_URL and QDRANT_API_KEY in .env")
        raise

def ensure_collection_exists(client, collection_name=COLLECTION_NAME, dimension=EMBEDDING_DIMENSION):
    """
    Ensure the collection exists, create if it doesn't.
    
    Args:
        client: QdrantClient instance
        collection_name: Name of the collection
        dimension: Vector dimension size
    
    Returns:
        bool: True if collection exists or was created successfully
    """
    try:
        # Check if collection exists
        collections = client.get_collections()
        collection_names = [col.name for col in collections.collections]
        
        if collection_name in collection_names:
            print(f"✅ Collection '{collection_name}' already exists")
            
            # Verify collection configuration
            collection_info = client.get_collection(collection_name)
            print(f"📊 Collection info:")
            print(f"   - Vectors count: {collection_info.vectors_count}")
            print(f"   - Points count: {collection_info.points_count}")
            
            return True
        
        # Create collection
        print(f"🔨 Creating collection '{collection_name}'...")
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(
                size=dimension,
                distance=Distance.COSINE
            )
        )
        print(f"✅ Collection '{collection_name}' created successfully")
        return True
    
    except Exception as e:
        print(f"❌ Error ensuring collection exists: {e}")
        raise

def delete_collection(client, collection_name=COLLECTION_NAME):
    """
    Delete a collection (useful for testing/reset).
    
    Args:
        client: QdrantClient instance
        collection_name: Name of the collection to delete
    
    Returns:
        bool: True if deleted successfully
    """
    try:
        client.delete_collection(collection_name)
        print(f"🗑️ Collection '{collection_name}' deleted successfully")
        return True
    except Exception as e:
        print(f"❌ Error deleting collection: {e}")
        return False

def get_collection_stats(client, collection_name=COLLECTION_NAME):
    """
    Get statistics about a collection.
    
    Args:
        client: QdrantClient instance
        collection_name: Name of the collection
    
    Returns:
        dict: Collection statistics
    """
    try:
        collection_info = client.get_collection(collection_name)
        
        stats = {
            "name": collection_name,
            "vectors_count": collection_info.vectors_count,
            "points_count": collection_info.points_count,
            "status": collection_info.status,
            "optimizer_status": collection_info.optimizer_status,
        }
        
        return stats
    
    except Exception as e:
        print(f"❌ Error getting collection stats: {e}")
        return None
