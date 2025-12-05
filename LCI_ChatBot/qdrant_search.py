"""
Search function using Qdrant vector database
"""
from sentence_transformers import SentenceTransformer
from qdrant_client.models import Filter, FieldCondition, MatchValue

from qdrant_config import get_qdrant_client, COLLECTION_NAME

# Cache the model to avoid reloading on every search
_model_cache = None

def get_model():
    """Get or initialize the embedding model (cached)."""
    global _model_cache
    if _model_cache is None:
        print("🧠 Loading Sentence Transformer model...")
        _model_cache = SentenceTransformer('all-MiniLM-L6-v2')
        print("✅ Model loaded and cached")
    return _model_cache

def search_chunks_qdrant(query, top_k=3, score_threshold=0.0, filters=None):
    """
    Search for relevant chunks using Qdrant vector database.
    
    Args:
        query (str): Search query
        top_k (int): Number of top results to return
        score_threshold (float): Minimum similarity score (0.0 to 1.0)
        filters (dict): Optional filters for metadata
            Example: {"source_file": "document.pdf", "page_number": 5}
    
    Returns:
        list: List of relevant chunks with similarity scores
    
    Example:
        >>> results = search_chunks_qdrant("What is Lean Canvas?", top_k=5)
        >>> for result in results:
        >>>     print(f"Score: {result['similarity']:.3f}")
        >>>     print(f"Text: {result['text'][:100]}...")
    """
    try:
        # Get Qdrant client
        client = get_qdrant_client()
        
        # Get embedding model
        model = get_model()
        
        # Encode query
        query_embedding = model.encode([query])[0].tolist()
        
        # Build filter if provided
        qdrant_filter = None
        if filters:
            conditions = []
            for key, value in filters.items():
                conditions.append(
                    FieldCondition(
                        key=key,
                        match=MatchValue(value=value)
                    )
                )
            if conditions:
                qdrant_filter = Filter(must=conditions)
        
        # Search in Qdrant
        search_results = client.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_embedding,
            limit=top_k,
            score_threshold=score_threshold,
            query_filter=qdrant_filter
        )
        
        # Format results
        results = []
        for hit in search_results:
            results.append({
                'chunk_id': hit.payload.get('chunk_id', 'unknown'),
                'text': hit.payload.get('text', ''),
                'similarity': float(hit.score),
                'preview': hit.payload.get('preview', ''),
                'token_count': hit.payload.get('token_count', 0),
                'source_file': hit.payload.get('source_file', 'unknown'),
                'page_number': hit.payload.get('page_number', 0),
                'chunk_index': hit.payload.get('chunk_index', 0)
            })
        
        return results
    
    except Exception as e:
        print(f"❌ Error searching Qdrant: {e}")
        print("💡 Make sure Qdrant is running and embeddings are uploaded")
        return []

def search_with_context(query, top_k=3, context_window=1):
    """
    Search and include surrounding chunks for better context.
    
    Args:
        query (str): Search query
        top_k (int): Number of top results to return
        context_window (int): Number of chunks before/after to include
    
    Returns:
        list: List of results with context chunks
    """
    try:
        # Get initial results
        results = search_chunks_qdrant(query, top_k=top_k)
        
        if not results:
            return []
        
        # Get Qdrant client
        client = get_qdrant_client()
        
        # For each result, fetch surrounding chunks
        enriched_results = []
        for result in results:
            chunk_index = result['chunk_index']
            source_file = result['source_file']
            
            # Get surrounding chunks
            context_chunks = []
            for offset in range(-context_window, context_window + 1):
                if offset == 0:
                    continue  # Skip the main chunk
                
                target_index = chunk_index + offset
                if target_index < 0:
                    continue
                
                # Search for chunk with specific index and source
                context_results = client.scroll(
                    collection_name=COLLECTION_NAME,
                    scroll_filter=Filter(
                        must=[
                            FieldCondition(
                                key="chunk_index",
                                match=MatchValue(value=target_index)
                            ),
                            FieldCondition(
                                key="source_file",
                                match=MatchValue(value=source_file)
                            )
                        ]
                    ),
                    limit=1
                )
                
                if context_results[0]:
                    context_chunks.append({
                        'text': context_results[0][0].payload.get('text', ''),
                        'offset': offset
                    })
            
            # Add context to result
            result['context_chunks'] = sorted(context_chunks, key=lambda x: x['offset'])
            enriched_results.append(result)
        
        return enriched_results
    
    except Exception as e:
        print(f"❌ Error searching with context: {e}")
        return search_chunks_qdrant(query, top_k=top_k)  # Fallback to basic search

def hybrid_search(query, top_k=3, keyword_boost=0.3):
    """
    Hybrid search combining vector similarity and keyword matching.
    
    Args:
        query (str): Search query
        top_k (int): Number of top results to return
        keyword_boost (float): Weight for keyword matching (0.0 to 1.0)
    
    Returns:
        list: List of results with hybrid scores
    """
    # Get vector search results
    vector_results = search_chunks_qdrant(query, top_k=top_k * 2)
    
    if not vector_results:
        return []
    
    # Extract keywords from query (simple approach)
    keywords = query.lower().split()
    
    # Re-score results with keyword boost
    for result in vector_results:
        text_lower = result['text'].lower()
        
        # Count keyword matches
        keyword_matches = sum(1 for kw in keywords if kw in text_lower)
        keyword_score = keyword_matches / len(keywords) if keywords else 0
        
        # Combine scores
        vector_score = result['similarity']
        hybrid_score = (1 - keyword_boost) * vector_score + keyword_boost * keyword_score
        
        result['hybrid_score'] = hybrid_score
        result['keyword_score'] = keyword_score
        result['vector_score'] = vector_score
    
    # Sort by hybrid score and return top_k
    vector_results.sort(key=lambda x: x['hybrid_score'], reverse=True)
    return vector_results[:top_k]

# Backward compatibility: alias for existing code
def search_chunks_sentence_transformer(query, top_k=3):
    """
    Backward compatible wrapper for existing code.
    Redirects to Qdrant search.
    """
    return search_chunks_qdrant(query, top_k=top_k)
