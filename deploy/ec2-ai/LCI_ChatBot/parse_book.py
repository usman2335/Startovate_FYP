"""
PDF Book Parser for LCI ChatBot Project - Python 3.10 Compatible
Parses PDF documents and extracts text, tables, and structured content.
"""

import os
import json
import logging
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional, Union
import re
from datetime import datetime

# Check Python version compatibility
if sys.version_info < (3, 8):
    raise RuntimeError("This script requires Python 3.8 or higher")

# PDF processing libraries - with error handling
try:
    import fitz  # PyMuPDF
    PYMUPDF_AVAILABLE = True
except ImportError:
    PYMUPDF_AVAILABLE = False
    logging.warning("PyMuPDF not available - some features will be limited")

try:
    import pdfplumber
    PDFPLUMBER_AVAILABLE = True
except ImportError:
    PDFPLUMBER_AVAILABLE = False
    logging.warning("pdfplumber not available - text extraction will be limited")

try:
    from unstructured.partition.pdf import partition_pdf
    UNSTRUCTURED_AVAILABLE = True
except ImportError:
    UNSTRUCTURED_AVAILABLE = False
    logging.warning("unstructured not available - advanced parsing disabled")

try:
    import camelot
    CAMELOT_AVAILABLE = True
except ImportError:
    CAMELOT_AVAILABLE = False
    logging.warning("camelot not available - table extraction limited")

try:
    import tabula
    TABULA_AVAILABLE = True
except ImportError:
    TABULA_AVAILABLE = False
    logging.warning("tabula not available - table extraction limited")

# Data processing
try:
    import pandas as pd
    PANDAS_AVAILABLE = True
except ImportError:
    PANDAS_AVAILABLE = False
    raise ImportError("pandas is required for this script")

try:
    import numpy as np
    NUMPY_AVAILABLE = True
except ImportError:
    NUMPY_AVAILABLE = False
    raise ImportError("numpy is required for this script")

# Text processing
try:
    import tiktoken
    TIKTOKEN_AVAILABLE = True
except ImportError:
    TIKTOKEN_AVAILABLE = False
    raise ImportError("tiktoken is required for this script")

try:
    from sentence_transformers import SentenceTransformer
    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError:
    SENTENCE_TRANSFORMERS_AVAILABLE = False
    logging.warning("sentence-transformers not available - semantic chunking disabled")

# Additional utilities
try:
    import cv2
    OPENCV_AVAILABLE = True
except ImportError:
    OPENCV_AVAILABLE = False
    logging.warning("opencv-python not available - some image processing features disabled")

try:
    from pdf2image import convert_from_path
    PDF2IMAGE_AVAILABLE = True
except ImportError:
    PDF2IMAGE_AVAILABLE = False
    logging.warning("pdf2image not available - image conversion disabled")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class PDFBookParser:
    """
    A comprehensive PDF parser that extracts text, tables, and metadata from PDF documents.
    """
    
    def __init__(self, pdf_path: str, output_dir: str = "parsed_content"):
        """
        Initialize the PDF parser.
        
        Args:
            pdf_path: Path to the PDF file
            output_dir: Directory to save parsed content
        """
        self.pdf_path = Path(pdf_path)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # Check availability of required packages
        if not TIKTOKEN_AVAILABLE:
            raise ImportError("tiktoken is required but not available")
        
        # Initialize tokenizer for chunking
        self.tokenizer = tiktoken.get_encoding("cl100k_base")
        
        # Initialize embedding model for semantic chunking
        self.embedding_model = None
        if SENTENCE_TRANSFORMERS_AVAILABLE:
            try:
                self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
                logger.info("Sentence transformer model loaded successfully")
            except Exception as e:
                logger.warning(f"Could not load embedding model: {e}")
        else:
            logger.info("Sentence transformers not available - using basic chunking only")
        
        # Validation
        if not self.pdf_path.exists():
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")
        
        # Log available features
        self._log_available_features()
        logger.info(f"Initialized PDF parser for: {self.pdf_path}")
    
    def _log_available_features(self):
        """Log which features are available based on installed packages."""
        features = []
        if PYMUPDF_AVAILABLE:
            features.append("PyMuPDF text extraction")
        if PDFPLUMBER_AVAILABLE:
            features.append("pdfplumber text extraction")
        if UNSTRUCTURED_AVAILABLE:
            features.append("unstructured content parsing")
        if CAMELOT_AVAILABLE:
            features.append("camelot table extraction")
        if TABULA_AVAILABLE:
            features.append("tabula table extraction")
        if self.embedding_model:
            features.append("semantic chunking")
        
        logger.info(f"Available features: {', '.join(features)}")
    
    def extract_metadata(self) -> Dict[str, Any]:
        """Extract metadata from the PDF document."""
        if not PYMUPDF_AVAILABLE:
            logger.warning("PyMuPDF not available - cannot extract metadata")
            return {
                'file_name': self.pdf_path.name,
                'file_size': self.pdf_path.stat().st_size,
                'parsed_at': datetime.now().isoformat()
            }
        
        try:
            doc = fitz.open(str(self.pdf_path))
            metadata = doc.metadata
            page_count = len(doc)
            doc.close()
            
            # Add file info
            metadata.update({
                'file_name': self.pdf_path.name,
                'file_size': self.pdf_path.stat().st_size,
                'page_count': page_count,
                'parsed_at': datetime.now().isoformat()
            })
            
            logger.info(f"Extracted metadata for {self.pdf_path.name}")
            return metadata
            
        except Exception as e:
            logger.error(f"Error extracting metadata: {e}")
            return {
                'file_name': self.pdf_path.name,
                'file_size': self.pdf_path.stat().st_size,
                'parsed_at': datetime.now().isoformat(),
                'error': str(e)
            }
    
    def extract_text_pymupdf(self) -> List[Dict[str, Any]]:
        """Extract text using PyMuPDF (fitz)."""
        if not PYMUPDF_AVAILABLE:
            logger.warning("PyMuPDF not available - skipping text extraction")
            return []
        
        pages_text = []
        
        try:
            doc = fitz.open(str(self.pdf_path))
            
            for page_num in range(len(doc)):
                page = doc[page_num]
                text = page.get_text()
                
                if text.strip():  # Only add non-empty pages
                    pages_text.append({
                        'page_number': page_num + 1,
                        'text': text,
                        'method': 'pymupdf',
                        'word_count': len(text.split()),
                        'char_count': len(text)
                    })
            
            doc.close()
            logger.info(f"Extracted text from {len(pages_text)} pages using PyMuPDF")
            
        except Exception as e:
            logger.error(f"Error extracting text with PyMuPDF: {e}")
        
        return pages_text
    
    def extract_text_pdfplumber(self) -> List[Dict[str, Any]]:
        """Extract text using pdfplumber."""
        if not PDFPLUMBER_AVAILABLE:
            logger.warning("pdfplumber not available - skipping text extraction")
            return []
        
        pages_text = []
        
        try:
            with pdfplumber.open(str(self.pdf_path)) as pdf:
                for page_num, page in enumerate(pdf.pages):
                    text = page.extract_text()
                    
                    if text and text.strip():
                        pages_text.append({
                            'page_number': page_num + 1,
                            'text': text,
                            'method': 'pdfplumber',
                            'word_count': len(text.split()),
                            'char_count': len(text)
                        })
            
            logger.info(f"Extracted text from {len(pages_text)} pages using pdfplumber")
            
        except Exception as e:
            logger.error(f"Error extracting text with pdfplumber: {e}")
        
        return pages_text
    
    def extract_tables_camelot(self) -> List[Dict[str, Any]]:
        """Extract tables using Camelot."""
        if not CAMELOT_AVAILABLE:
            logger.warning("Camelot not available - skipping table extraction")
            return []
        
        tables = []
        
        try:
            # Extract tables from all pages
            camelot_tables = camelot.read_pdf(str(self.pdf_path), pages='all')
            
            for i, table in enumerate(camelot_tables):
                if not table.df.empty:
                    tables.append({
                        'table_id': i + 1,
                        'page_number': table.page,
                        'method': 'camelot',
                        'accuracy': table.accuracy,
                        'data': table.df.to_dict('records'),
                        'shape': table.df.shape
                    })
            
            logger.info(f"Extracted {len(tables)} tables using Camelot")
            
        except Exception as e:
            logger.error(f"Error extracting tables with Camelot: {e}")
        
        return tables
    
    def extract_tables_tabula(self) -> List[Dict[str, Any]]:
        """Extract tables using Tabula."""
        if not TABULA_AVAILABLE:
            logger.warning("Tabula not available - skipping table extraction")
            return []
        
        tables = []
        
        try:
            # Extract tables from all pages
            tabula_tables = tabula.read_pdf(str(self.pdf_path), pages='all', multiple_tables=True)
            
            for i, table in enumerate(tabula_tables):
                if not table.empty:
                    tables.append({
                        'table_id': i + 1,
                        'page_number': i + 1,  # Tabula doesn't always provide page numbers
                        'method': 'tabula',
                        'data': table.to_dict('records'),
                        'shape': table.shape
                    })
            
            logger.info(f"Extracted {len(tables)} tables using Tabula")
            
        except Exception as e:
            logger.error(f"Error extracting tables with Tabula: {e}")
        
        return tables
    
    def extract_with_unstructured(self) -> List[Dict[str, Any]]:
        """Extract content using Unstructured library."""
        if not UNSTRUCTURED_AVAILABLE:
            logger.warning("Unstructured not available - skipping advanced parsing")
            return []
        
        elements = []
        
        try:
            # Partition the PDF
            pdf_elements = partition_pdf(str(self.pdf_path))
            
            for element in pdf_elements:
                element_dict = {
                    'type': str(type(element).__name__),
                    'text': str(element),
                    'metadata': element.metadata if hasattr(element, 'metadata') else {}
                }
                elements.append(element_dict)
            
            logger.info(f"Extracted {len(elements)} elements using Unstructured")
            
        except Exception as e:
            logger.error(f"Error extracting with Unstructured: {e}")
        
        return elements
    
    def chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 100) -> List[Dict[str, Any]]:
        """Split text into chunks for better processing."""
        if not text.strip():
            return []
        
        # Tokenize the text
        tokens = self.tokenizer.encode(text)
        chunks = []
        
        for i in range(0, len(tokens), chunk_size - overlap):
            chunk_tokens = tokens[i:i + chunk_size]
            chunk_text = self.tokenizer.decode(chunk_tokens)
            
            chunks.append({
                'chunk_id': len(chunks) + 1,
                'text': chunk_text,
                'token_count': len(chunk_tokens),
                'char_count': len(chunk_text),
                'start_token': i,
                'end_token': min(i + chunk_size, len(tokens))
            })
        
        return chunks
    
    def semantic_chunk_text(self, text: str, chunk_size: int = 1000) -> List[Dict[str, Any]]:
        """Create semantic chunks based on sentence boundaries and embeddings."""
        if not self.embedding_model or not text.strip():
            logger.info("Using regular chunking instead of semantic chunking")
            return self.chunk_text(text, chunk_size)
        
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        if not sentences:
            return []
        
        chunks = []
        current_chunk = []
        current_size = 0
        
        for sentence in sentences:
            sentence_tokens = len(self.tokenizer.encode(sentence))
            
            if current_size + sentence_tokens > chunk_size and current_chunk:
                # Create chunk from current sentences
                chunk_text = ' '.join(current_chunk)
                chunks.append({
                    'chunk_id': len(chunks) + 1,
                    'text': chunk_text,
                    'token_count': current_size,
                    'char_count': len(chunk_text),
                    'type': 'semantic'
                })
                
                current_chunk = [sentence]
                current_size = sentence_tokens
            else:
                current_chunk.append(sentence)
                current_size += sentence_tokens
        
        # Add remaining sentences as final chunk
        if current_chunk:
            chunk_text = ' '.join(current_chunk)
            chunks.append({
                'chunk_id': len(chunks) + 1,
                'text': chunk_text,
                'token_count': current_size,
                'char_count': len(chunk_text),
                'type': 'semantic'
            })
        
        return chunks
    
    def process_all_content(self) -> Dict[str, Any]:
        """Process all content from the PDF and return structured data."""
        logger.info("Starting comprehensive PDF processing...")
        
        result = {
            'metadata': self.extract_metadata(),
            'text_extraction': {},
            'tables': {},
            'unstructured_elements': [],
            'processed_chunks': []
        }
        
        # Extract text using different methods
        result['text_extraction']['pymupdf'] = self.extract_text_pymupdf()
        result['text_extraction']['pdfplumber'] = self.extract_text_pdfplumber()
        
        # Extract tables
        result['tables']['camelot'] = self.extract_tables_camelot()
        result['tables']['tabula'] = self.extract_tables_tabula()
        
        # Extract with unstructured
        result['unstructured_elements'] = self.extract_with_unstructured()
        
        # Create chunks from the best available text extraction method
        best_text = []
        if result['text_extraction']['pdfplumber']:
            best_text = result['text_extraction']['pdfplumber']
        elif result['text_extraction']['pymupdf']:
            best_text = result['text_extraction']['pymupdf']
        
        if not best_text:
            logger.error("No text could be extracted from the PDF")
            return result
        
        all_text = '\n\n'.join([page['text'] for page in best_text])
        
        # Create both regular and semantic chunks
        result['processed_chunks'] = {
            'regular_chunks': self.chunk_text(all_text),
            'semantic_chunks': self.semantic_chunk_text(all_text)
        }
        
        logger.info("PDF processing completed successfully")
        return result
    
    def save_results(self, results: Dict[str, Any], format: str = 'json') -> None:
        """Save the parsing results to files."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        base_name = self.pdf_path.stem
        
        if format.lower() == 'json':
            output_file = self.output_dir / f"{base_name}_parsed_{timestamp}.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            logger.info(f"Results saved to: {output_file}")
        
        elif format.lower() == 'csv':
            # Save text chunks as CSV
            chunks_file = self.output_dir / f"{base_name}_chunks_{timestamp}.csv"
            chunks_data = []
            
            for chunk in results['processed_chunks']['regular_chunks']:
                chunks_data.append({
                    'chunk_id': chunk['chunk_id'],
                    'text': chunk['text'],
                    'token_count': chunk['token_count'],
                    'char_count': chunk['char_count']
                })
            
            df = pd.DataFrame(chunks_data)
            df.to_csv(chunks_file, index=False, encoding='utf-8')
            logger.info(f"Chunks saved to: {chunks_file}")
        
        # Save summary
        summary_file = self.output_dir / f"{base_name}_summary_{timestamp}.txt"
        with open(summary_file, 'w', encoding='utf-8') as f:
            f.write(f"PDF Processing Summary\n")
            f.write(f"=====================\n\n")
            f.write(f"File: {results['metadata'].get('file_name', 'Unknown')}\n")
            f.write(f"Pages: {results['metadata'].get('page_count', 'Unknown')}\n")
            f.write(f"File Size: {results['metadata'].get('file_size', 'Unknown')} bytes\n\n")
            
            f.write(f"Text Extraction:\n")
            f.write(f"- PyMuPDF: {len(results['text_extraction']['pymupdf'])} pages\n")
            f.write(f"- pdfplumber: {len(results['text_extraction']['pdfplumber'])} pages\n\n")
            
            f.write(f"Tables:\n")
            f.write(f"- Camelot: {len(results['tables']['camelot'])} tables\n")
            f.write(f"- Tabula: {len(results['tables']['tabula'])} tables\n\n")
            
            f.write(f"Chunks:\n")
            f.write(f"- Regular chunks: {len(results['processed_chunks']['regular_chunks'])}\n")
            f.write(f"- Semantic chunks: {len(results['processed_chunks']['semantic_chunks'])}\n")
        
        logger.info(f"Summary saved to: {summary_file}")


def main():
    """Main function to parse the LCI book."""
    # Path to the PDF file
    pdf_path = "PDF/LCI_BOOK_FINAL.pdf"
    
    try:
        # Initialize parser
        parser = PDFBookParser(pdf_path)
        
        # Process the PDF
        results = parser.process_all_content()
        
        # Save results
        parser.save_results(results, format='json')
        parser.save_results(results, format='csv')
        
        # Print summary
        print("\n" + "="*50)
        print("PDF PARSING COMPLETED SUCCESSFULLY")
        print("="*50)
        print(f"File: {results['metadata'].get('file_name', 'Unknown')}")
        print(f"Pages: {results['metadata'].get('page_count', 'Unknown')}")
        print(f"Text pages (PyMuPDF): {len(results['text_extraction']['pymupdf'])}")
        print(f"Text pages (pdfplumber): {len(results['text_extraction']['pdfplumber'])}")
        print(f"Tables (Camelot): {len(results['tables']['camelot'])}")
        print(f"Tables (Tabula): {len(results['tables']['tabula'])}")
        print(f"Regular chunks: {len(results['processed_chunks']['regular_chunks'])}")
        print(f"Semantic chunks: {len(results['processed_chunks']['semantic_chunks'])}")
        print(f"Unstructured elements: {len(results['unstructured_elements'])}")
        print("\nResults saved to 'parsed_content' directory")
        
    except Exception as e:
        logger.error(f"Error in main execution: {e}")
        print(f"Error: {e}")


if __name__ == "__main__":
    main()
