"""
Qdrant Collection Management Utility

This script provides utilities for managing Qdrant collections:
- View collection info
- Delete collections
- Backup/restore collections
- Search and inspect data
"""
import json
import argparse
from qdrant_config import (
    get_qdrant_client,
    get_collection_stats,
    delete_collection,
    ensure_collection_exists,
    COLLECTION_NAME
)
from qdrant_search import search_chunks_qdrant

def list_collections(client):
    """List all collections."""
    print("\n📚 Collections:")
    print("-" * 80)
    
    collections = client.get_collections()
    
    if not collections.collections:
        print("No collections found")
        return
    
    for col in collections.collections:
        print(f"\n📁 {col.name}")
        try:
            stats = get_collection_stats(client, col.name)
            if stats:
                print(f"   Points: {stats['points_count']}")
                print(f"   Vectors: {stats['vectors_count']}")
                print(f"   Status: {stats['status']}")
        except Exception as e:
            print(f"   Error getting stats: {e}")

def show_collection_info(client, collection_name):
    """Show detailed collection information."""
    print(f"\n📊 Collection: {collection_name}")
    print("-" * 80)
    
    try:
        collection = client.get_collection(collection_name)
        
        print(f"\nBasic Info:")
        print(f"  Points count: {collection.points_count}")
        print(f"  Vectors count: {collection.vectors_count}")
        print(f"  Status: {collection.status}")
        print(f"  Optimizer status: {collection.optimizer_status}")
        
        print(f"\nVector Config:")
        print(f"  Size: {collection.config.params.vectors.size}")
        print(f"  Distance: {collection.config.params.vectors.distance}")
        
        # Sample a few points
        print(f"\nSample Points:")
        points, _ = client.scroll(
            collection_name=collection_name,
            limit=3
        )
        
        for i, point in enumerate(points, 1):
            print(f"\n  Point {i}:")
            print(f"    ID: {point.id}")
            print(f"    Chunk ID: {point.payload.get('chunk_id', 'N/A')}")
            print(f"    Source: {point.payload.get('source_file', 'N/A')}")
            print(f"    Preview: {point.payload.get('preview', 'N/A')[:80]}...")
    
    except Exception as e:
        print(f"❌ Error: {e}")

def search_collection(client, collection_name, query, top_k=5):
    """Search in collection."""
    print(f"\n🔍 Searching: '{query}'")
    print("-" * 80)
    
    try:
        results = search_chunks_qdrant(query, top_k=top_k)
        
        if not results:
            print("No results found")
            return
        
        for i, result in enumerate(results, 1):
            print(f"\n{i}. Score: {result['similarity']:.4f}")
            print(f"   Chunk ID: {result['chunk_id']}")
            print(f"   Source: {result['source_file']} (Page {result['page_number']})")
            print(f"   Text: {result['text'][:150]}...")
    
    except Exception as e:
        print(f"❌ Error: {e}")

def export_collection(client, collection_name, output_file):
    """Export collection to JSON file."""
    print(f"\n💾 Exporting collection '{collection_name}' to {output_file}")
    print("-" * 80)
    
    try:
        points = []
        offset = None
        
        while True:
            batch, offset = client.scroll(
                collection_name=collection_name,
                limit=100,
                offset=offset
            )
            
            if not batch:
                break
            
            for point in batch:
                points.append({
                    "id": point.id,
                    "vector": point.vector,
                    "payload": point.payload
                })
            
            print(f"  Exported {len(points)} points...", end="\r")
            
            if offset is None:
                break
        
        with open(output_file, 'w') as f:
            json.dump(points, f, indent=2)
        
        print(f"\n✅ Exported {len(points)} points to {output_file}")
    
    except Exception as e:
        print(f"❌ Error: {e}")

def import_collection(client, collection_name, input_file, batch_size=100):
    """Import collection from JSON file."""
    print(f"\n📥 Importing collection '{collection_name}' from {input_file}")
    print("-" * 80)
    
    try:
        with open(input_file, 'r') as f:
            points = json.load(f)
        
        print(f"Loaded {len(points)} points from file")
        
        # Ensure collection exists
        ensure_collection_exists(client, collection_name)
        
        # Upload in batches
        from qdrant_client.models import PointStruct
        
        for i in range(0, len(points), batch_size):
            batch = points[i:i + batch_size]
            
            qdrant_points = [
                PointStruct(
                    id=p["id"],
                    vector=p["vector"],
                    payload=p["payload"]
                )
                for p in batch
            ]
            
            client.upsert(
                collection_name=collection_name,
                points=qdrant_points
            )
            
            print(f"  Imported {min(i + batch_size, len(points))}/{len(points)} points...", end="\r")
        
        print(f"\n✅ Imported {len(points)} points to {collection_name}")
    
    except Exception as e:
        print(f"❌ Error: {e}")

def delete_collection_interactive(client, collection_name):
    """Delete collection with confirmation."""
    print(f"\n⚠️ WARNING: This will delete collection '{collection_name}'")
    
    confirm = input("Type 'DELETE' to confirm: ").strip()
    
    if confirm == "DELETE":
        try:
            delete_collection(client, collection_name)
            print(f"✅ Collection '{collection_name}' deleted")
        except Exception as e:
            print(f"❌ Error: {e}")
    else:
        print("❌ Deletion cancelled")

def main():
    """Main CLI interface."""
    parser = argparse.ArgumentParser(
        description="Qdrant Collection Management Utility",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # List all collections
  python qdrant_manager.py list
  
  # Show collection info
  python qdrant_manager.py info
  
  # Search in collection
  python qdrant_manager.py search "What is Lean Canvas?"
  
  # Export collection
  python qdrant_manager.py export backup.json
  
  # Import collection
  python qdrant_manager.py import backup.json
  
  # Delete collection
  python qdrant_manager.py delete
        """
    )
    
    parser.add_argument(
        "command",
        choices=["list", "info", "search", "export", "import", "delete"],
        help="Command to execute"
    )
    
    parser.add_argument(
        "args",
        nargs="*",
        help="Command arguments"
    )
    
    parser.add_argument(
        "--collection",
        default=COLLECTION_NAME,
        help=f"Collection name (default: {COLLECTION_NAME})"
    )
    
    parser.add_argument(
        "--top-k",
        type=int,
        default=5,
        help="Number of search results (default: 5)"
    )
    
    args = parser.parse_args()
    
    # Connect to Qdrant
    print("🔌 Connecting to Qdrant...")
    try:
        client = get_qdrant_client()
    except Exception as e:
        print(f"❌ Failed to connect: {e}")
        return 1
    
    # Execute command
    try:
        if args.command == "list":
            list_collections(client)
        
        elif args.command == "info":
            show_collection_info(client, args.collection)
        
        elif args.command == "search":
            if not args.args:
                print("❌ Error: Search query required")
                return 1
            query = " ".join(args.args)
            search_collection(client, args.collection, query, args.top_k)
        
        elif args.command == "export":
            if not args.args:
                print("❌ Error: Output file required")
                return 1
            export_collection(client, args.collection, args.args[0])
        
        elif args.command == "import":
            if not args.args:
                print("❌ Error: Input file required")
                return 1
            import_collection(client, args.collection, args.args[0])
        
        elif args.command == "delete":
            delete_collection_interactive(client, args.collection)
        
        return 0
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1

if __name__ == "__main__":
    exit(main())
