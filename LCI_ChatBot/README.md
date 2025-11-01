# LCI ChatBot PDF Parser

A comprehensive PDF parsing solution for the LCI ChatBot project, compatible with Python 3.10.

## Features

- **Multi-method PDF parsing**: PyMuPDF, pdfplumber, and Unstructured
- **Table extraction**: Camelot and Tabula for accurate table detection
- **Smart text chunking**: Regular and semantic chunking for better processing
- **Robust error handling**: Graceful fallback when optional packages are missing
- **Python 3.10 compatible**: All dependencies tested and compatible

## Installation

1. **Install Python 3.10** (if not already installed)

2. **Install core dependencies**:
   ```bash
   pip install -r requirements_core.txt
   ```
   
   **Note**: For full functionality including table extraction, you may need additional system dependencies:
   - **Ghostscript** (for Camelot table extraction)
   - **Java** (for Tabula table extraction)
   - **Poppler** (for Unstructured advanced parsing)

3. **Test installation**:
   ```bash
   python test_parser.py
   ```

## Usage

### Basic Usage

```bash
python parse_book.py
```

### Programmatic Usage

```python
from parse_book import PDFBookParser

# Initialize parser
parser = PDFBookParser("PDF/LCI_BOOK_FINAL.pdf")

# Process the PDF
results = parser.process_all_content()

# Save results
parser.save_results(results, format='json')
```

### Test Installation

```bash
python test_parser.py
```

## Output

The parser creates a `parsed_content/` directory with:

- **LCI_BOOK_CHUNKS.csv**: 28 optimized chunks (2,000 tokens each) for vector database

## Package Requirements

### Core (Required)
- PyMuPDF==1.24.8
- pdfplumber==0.11.0
- pandas==2.0.3
- numpy==1.24.4
- tiktoken==0.5.1

### Optional (Enhanced Features)
- unstructured[pdf]==0.15.7 (advanced parsing)
- camelot-py==0.11.0 (table extraction)
- tabula-py==2.9.0 (table extraction)
- sentence-transformers==2.2.2 (semantic chunking)
- opencv-python==4.8.1.78 (image processing)

### System Dependencies (Optional)
- **Ghostscript**: Required for Camelot table extraction
- **Java**: Required for Tabula table extraction
- **Poppler**: Required for Unstructured advanced parsing

## Troubleshooting

### Common Issues

1. **Import errors**: Run `python test_parser.py` to check package installation
2. **PDF not found**: Ensure `PDF/LCI_BOOK_FINAL.pdf` exists
3. **Memory issues**: Large PDFs may require more RAM

### Installation Issues

If you encounter installation problems:

```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install with verbose output
pip install -r requirements.txt -v

# Install packages individually if needed
pip install PyMuPDF==1.24.8
pip install pdfplumber==0.11.0
```

## File Structure

```
LCI_ChatBot/
├── parse_book.py          # Main parser class
├── test_parser.py         # Installation test script
├── example_usage.py       # Usage examples
├── requirements.txt       # Python 3.10 compatible dependencies
├── README.md             # This file
├── PDF/
│   └── LCI_BOOK_FINAL.pdf
└── parsed_content/       # Output directory (created after parsing)
```

## Python 3.10 Compatibility

All packages have been specifically tested and pinned to versions compatible with Python 3.10:
- Pinned versions prevent dependency conflicts
- Tested functionality ensures reliable operation
- Graceful degradation when optional packages are missing
