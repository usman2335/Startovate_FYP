# Qdrant Vector Database - LCI ChatBot

## Overview
The chatbot uses Qdrant Cloud for storing and searching embeddings. This enables fast semantic search across your LCI knowledge base.

## Configuration

### .env File
```env
QDRANT_URL=https://bd85bc5d-fc9c-4cca-b77f-d5b8eaae1acf.europe-west3-0.gcp.cloud.qdrant.io
QDRANT_API_KEY=your_api_key_here
QDRANT_COLLECTION_NAME=lci_knowledge_base
```

## Files

**Essential (Keep):**
- `qdrant_config.py` - Connection management
- `qdrant_search.py` - Search functions
- `.env` - Configuration

**Optional (Can delete):**
- `qdrant_embeddings.py` - Create new embeddings
- `migrate_to_qdrant.py` - Migration tool (already done)
- `qdrant_manager.py` - Management CLI
- `setup_qdrant.py` - Setup wizard
- All other QDRANT_*.md files

## Usage

### Search in Code
```python
from qdrant_search import search_chunks_qdrant

# Basic search
results = search_chunks_qdrant("What is Lean Canvas?", top_k=5)

# With filters
results = search_chunks_qdrant(
    query="customer segments",
    filters={"source_file": "guide.pdf"}
)
```

### Current Status
- **Collection**: lci_knowledge_base
- **Embeddings**: 467 vectors
- **Status**: ✅ Active and working
- **Dashboard**: Your Qdrant Cloud console

## Troubleshooting

**Connection Failed:**
- Check `.env` has correct QDRANT_URL and QDRANT_API_KEY
- Verify cluster is running in Qdrant Cloud console

**No Results:**
- Check collection exists in dashboard
- Verify embeddings were uploaded (467 points)

## Adding New Content

If you add new PDFs:
```bash
# 1. Parse PDFs first
python parse_pdfs.py

# 2. Create embeddings and upload to Qdrant
python qdrant_embeddings.py
```

## Notes
- Main.py uses Qdrant exclusively (no fallback)
- Each user has isolated chat history
- Responses optimized for concise, natural length
