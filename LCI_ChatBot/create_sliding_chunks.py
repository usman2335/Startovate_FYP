"""
Create chunks using sliding window approach with slight overlap
Target: 300-500 chunks, 500-800 tokens each, Min >100, Max <900
"""

import json
import pandas as pd
from parse_book import PDFBookParser

def create_sliding_chunks():
    """
    Create chunks using sliding window approach with slight overlap.
    This will give us better coverage and more chunks.
    """
    
    print("Creating chunks using sliding window approach...")
    print("Target: 300-500 chunks, 500-800 tokens each, Min >100, Max <900")
    
    # Initialize parser
    parser = PDFBookParser("PDF/LCI_BOOK_FINAL.pdf", output_dir="parsed_content")
    
    # Extract text using the best method
    text_pages = parser.extract_text_pdfplumber()
    if not text_pages:
        text_pages = parser.extract_text_pymupdf()
    
    if not text_pages:
        print("No text could be extracted!")
        return
    
    # Combine all text
    all_text = '\n\n'.join([page['text'] for page in text_pages])
    print(f"Total text length: {len(all_text):,} characters")
    
    # Use sliding window approach with slight overlap
    # We'll create multiple overlapping windows to get more chunks
    chunk_size = 2000  # Much larger chunk size for 500-800 tokens
    overlap = 300      # Larger overlap for sliding window
    step_size = 600    # Larger step size to get 300-500 chunks
    
    print(f"Using sliding window: chunk_size={chunk_size}, overlap={overlap}, step_size={step_size}")
    
    # Create chunks with sliding window approach
    chunks = parser.chunk_text(all_text, chunk_size=chunk_size, overlap=overlap)
    
    print(f"Created {len(chunks)} chunks with base approach")
    
    # If we don't have enough chunks, use sliding window approach
    if len(chunks) < 300:
        print("Not enough chunks, using sliding window approach...")
        
        # Create sliding windows manually
        chunks = []
        text_length = len(all_text)
        chunk_id = 1
        
        # Create overlapping chunks with sliding window
        for start in range(0, text_length, step_size):
            end = min(start + chunk_size, text_length)
            chunk_text = all_text[start:end]
            
            if len(chunk_text.strip()) > 50:  # Only include substantial chunks
                # Calculate token count (rough estimate: 1 token ≈ 4 characters)
                token_count = len(chunk_text) // 4
                
                chunk = {
                    'chunk_id': chunk_id,
                    'text': chunk_text,
                    'token_count': token_count,
                    'char_count': len(chunk_text)
                }
                chunks.append(chunk)
                chunk_id += 1
        
        print(f"Created {len(chunks)} chunks with sliding window approach")
    
    # If we have too many chunks, reduce step size
    if len(chunks) > 500:
        print("Too many chunks, reducing step size...")
        step_size = 500  # Much larger step size to get 300-500 chunks
        chunks = []
        chunk_id = 1
        
        for start in range(0, text_length, step_size):
            end = min(start + chunk_size, text_length)
            chunk_text = all_text[start:end]
            
            if len(chunk_text.strip()) > 50:
                token_count = len(chunk_text) // 4
                
                chunk = {
                    'chunk_id': chunk_id,
                    'text': chunk_text,
                    'token_count': token_count,
                    'char_count': len(chunk_text)
                }
                chunks.append(chunk)
                chunk_id += 1
        
        print(f"Created {len(chunks)} chunks with reduced step size")
    
    # Create enhanced chunks with metadata
    enhanced_chunks = []
    for i, chunk in enumerate(chunks):
        # Extract some context for better chunk identification
        text_preview = chunk['text'][:150].replace('\n', ' ')
        
        enhanced_chunk = {
            'chunk_id': chunk['chunk_id'],
            'text': chunk['text'],
            'token_count': chunk['token_count'],
            'char_count': chunk['char_count'],
            'preview': text_preview,
            'chunk_size_category': get_chunk_size_category(chunk['token_count']),
            'estimated_pages': estimate_pages(chunk['token_count']),
            'has_table': 'table' in chunk['text'].lower() or 'figure' in chunk['text'].lower(),
            'has_definition': any(word in chunk['text'].lower() for word in ['define', 'definition', 'meaning', 'refers to']),
            'has_example': any(word in chunk['text'].lower() for word in ['example', 'for instance', 'such as', 'case study']),
            'has_chapter': any(word in chunk['text'].lower() for word in ['chapter', 'section', 'part']),
            'has_numbered_list': any(char.isdigit() and '.' in chunk['text'][:100] for char in chunk['text'][:100])
        }
        enhanced_chunks.append(enhanced_chunk)
    
    # Create JSON output
    output_data = {
        'metadata': {
            'total_chunks': len(chunks),
            'total_tokens': sum(chunk['token_count'] for chunk in chunks),
            'avg_tokens_per_chunk': sum(chunk['token_count'] for chunk in chunks) / len(chunks),
            'min_tokens': min(chunk['token_count'] for chunk in chunks),
            'max_tokens': max(chunk['token_count'] for chunk in chunks),
            'chunk_size_target': chunk_size,
            'overlap': overlap,
            'step_size': step_size,
            'approach': 'sliding_window',
            'source_file': 'LCI_BOOK_FINAL.pdf'
        },
        'chunks': enhanced_chunks
    }
    
    # Save as JSON
    output_file = "parsed_content/LCI_BOOK_SLIDING_CHUNKS.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"Saved sliding chunks to: {output_file}")
    
    # Print summary
    total_tokens = sum(chunk['token_count'] for chunk in chunks)
    avg_tokens = total_tokens / len(chunks) if chunks else 0
    min_tokens = min(chunk['token_count'] for chunk in chunks)
    max_tokens = max(chunk['token_count'] for chunk in chunks)
    
    print(f"\nSliding Window Chunk Summary:")
    print(f"Total chunks: {len(chunks)}")
    print(f"Total tokens: {total_tokens:,}")
    print(f"Average tokens per chunk: {avg_tokens:.1f}")
    print(f"Min tokens: {min_tokens}")
    print(f"Max tokens: {max_tokens}")
    
    # Check if we meet the target
    target_met = (
        300 <= len(chunks) <= 500 and
        500 <= avg_tokens <= 800 and
        min_tokens > 100 and
        max_tokens < 900
    )
    
    if target_met:
        print("✅ TARGET ACHIEVED!")
    else:
        print("⚠️  Target not fully met, but close!")
        print(f"Chunk count: {len(chunks)} (target: 300-500)")
        print(f"Avg tokens: {avg_tokens:.1f} (target: 500-800)")
        print(f"Min tokens: {min_tokens} (target: >100)")
        print(f"Max tokens: {max_tokens} (target: <900)")
    
    # Show chunk size distribution
    size_distribution = {}
    for chunk in chunks:
        size_cat = get_chunk_size_category(chunk['token_count'])
        size_distribution[size_cat] = size_distribution.get(size_cat, 0) + 1
    
    print(f"\nChunk size distribution:")
    for size, count in size_distribution.items():
        print(f"  {size}: {count} chunks")
    
    return output_file

def get_chunk_size_category(token_count):
    """Categorize chunk by size."""
    if token_count < 200:
        return "Very Small"
    elif token_count < 400:
        return "Small"
    elif token_count < 600:
        return "Medium"
    elif token_count < 800:
        return "Large"
    else:
        return "Very Large"

def estimate_pages(token_count):
    """Rough estimate of pages based on token count."""
    # Assuming ~1000 tokens per page
    return round(token_count / 1000, 1)

if __name__ == "__main__":
    print("Sliding Window Chunking Strategy:")
    print("Target: 300-500 chunks")
    print("Target: 500-800 tokens each")
    print("Target: Min >100, Max <900")
    print("Approach: Sliding window with slight overlap")
    print("Output: JSON format")
    
    output_file = create_sliding_chunks()
    
    print(f"\n✅ Sliding window chunks ready!")
    print(f"File: {output_file}")
    print(f"\nThis approach provides:")
    print("• Better coverage with overlapping windows")
    print("• More chunks for better granularity")
    print("• Sliding window approach for comprehensive coverage")
    print("• Optimal for RAG systems")
