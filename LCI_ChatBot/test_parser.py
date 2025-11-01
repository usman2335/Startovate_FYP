"""
Test script for the PDF parser - Python 3.10 Compatible
Run this to test the installation and basic functionality.
"""

import sys
import os
from pathlib import Path

def test_python_version():
    """Test if Python version is compatible."""
    print("Testing Python version...")
    version = sys.version_info
    print(f"Python version: {version.major}.{version.minor}.{version.micro}")
    
    if version.major == 3 and version.minor == 10:
        print("✓ Python 3.10 detected - fully compatible")
        return True
    elif version.major == 3 and version.minor >= 8:
        print("✓ Python 3.8+ detected - should work")
        return True
    else:
        print(f"⚠ Python {version.major}.{version.minor} detected - may have compatibility issues")
        return False

def test_core_imports():
    """Test core required packages."""
    print("\nTesting core imports...")
    core_packages = []
    
    try:
        import fitz
        print("✓ PyMuPDF (fitz) imported successfully")
        core_packages.append(True)
    except ImportError as e:
        print(f"✗ PyMuPDF (fitz) import failed: {e}")
        core_packages.append(False)
    
    try:
        import pdfplumber
        print("✓ pdfplumber imported successfully")
        core_packages.append(True)
    except ImportError as e:
        print(f"✗ pdfplumber import failed: {e}")
        core_packages.append(False)
    
    try:
        import pandas
        print("✓ pandas imported successfully")
        core_packages.append(True)
    except ImportError as e:
        print(f"✗ pandas import failed: {e}")
        core_packages.append(False)
    
    try:
        import numpy
        print("✓ numpy imported successfully")
        core_packages.append(True)
    except ImportError as e:
        print(f"✗ numpy imported successfully")
        core_packages.append(False)
    
    try:
        import tiktoken
        print("✓ tiktoken imported successfully")
        core_packages.append(True)
    except ImportError as e:
        print(f"✗ tiktoken import failed: {e}")
        core_packages.append(False)
    
    return all(core_packages)

def test_optional_imports():
    """Test optional packages."""
    print("\nTesting optional imports...")
    optional_packages = []
    
    # PDF Processing
    try:
        from unstructured.partition.pdf import partition_pdf
        print("✓ unstructured imported successfully")
        optional_packages.append(True)
    except ImportError as e:
        print(f"⚠ unstructured import failed (optional): {e}")
        optional_packages.append(False)
    
    try:
        import camelot
        print("✓ camelot imported successfully")
        optional_packages.append(True)
    except ImportError as e:
        print(f"⚠ camelot import failed (optional): {e}")
        optional_packages.append(False)
    
    try:
        import tabula
        print("✓ tabula imported successfully")
        optional_packages.append(True)
    except ImportError as e:
        print(f"⚠ tabula import failed (optional): {e}")
        optional_packages.append(False)
    
    # ML/AI packages
    try:
        from sentence_transformers import SentenceTransformer
        print("✓ sentence-transformers imported successfully")
        optional_packages.append(True)
    except ImportError as e:
        print(f"⚠ sentence-transformers import failed (optional): {e}")
        optional_packages.append(False)
    
    try:
        import torch
        print(f"✓ torch imported successfully (version: {torch.__version__})")
        optional_packages.append(True)
    except ImportError as e:
        print(f"⚠ torch import failed (optional): {e}")
        optional_packages.append(False)
    
    try:
        import transformers
        print(f"✓ transformers imported successfully (version: {transformers.__version__})")
        optional_packages.append(True)
    except ImportError as e:
        print(f"⚠ transformers import failed (optional): {e}")
        optional_packages.append(False)
    
    # Additional utilities
    try:
        import cv2
        print(f"✓ opencv-python imported successfully (version: {cv2.__version__})")
        optional_packages.append(True)
    except ImportError as e:
        print(f"⚠ opencv-python import failed (optional): {e}")
        optional_packages.append(False)
    
    try:
        from pdf2image import convert_from_path
        print("✓ pdf2image imported successfully")
        optional_packages.append(True)
    except ImportError as e:
        print(f"⚠ pdf2image import failed (optional): {e}")
        optional_packages.append(False)
    
    return optional_packages

def check_pdf_file():
    """Check if the PDF file exists."""
    pdf_path = Path("PDF/LCI_BOOK_FINAL.pdf")
    if pdf_path.exists():
        print(f"✓ PDF file found: {pdf_path}")
        file_size = pdf_path.stat().st_size
        print(f"  File size: {file_size:,} bytes ({file_size/1024/1024:.2f} MB)")
        return True
    else:
        print(f"✗ PDF file not found: {pdf_path}")
        return False

def test_basic_functionality():
    """Test basic functionality with available packages."""
    print("\nTesting basic functionality...")
    
    try:
        # Test tiktoken functionality
        import tiktoken
        enc = tiktoken.get_encoding("cl100k_base")
        test_text = "This is a test sentence for tokenization."
        tokens = enc.encode(test_text)
        decoded = enc.decode(tokens)
        if decoded == test_text:
            print("✓ tiktoken functionality working correctly")
        else:
            print("✗ tiktoken functionality test failed")
            return False
    except Exception as e:
        print(f"✗ tiktoken functionality test failed: {e}")
        return False
    
    try:
        # Test pandas functionality
        import pandas as pd
        import numpy as np
        df = pd.DataFrame({'test': [1, 2, 3], 'values': [4, 5, 6]})
        if len(df) == 3:
            print("✓ pandas functionality working correctly")
        else:
            print("✗ pandas functionality test failed")
            return False
    except Exception as e:
        print(f"✗ pandas functionality test failed: {e}")
        return False
    
    return True

def main():
    """Main test function."""
    print("PDF Parser Test Script - Python 3.10 Compatible")
    print("=" * 50)
    
    # Test Python version
    python_ok = test_python_version()
    
    # Test core imports
    core_ok = test_core_imports()
    
    # Test optional imports
    optional_results = test_optional_imports()
    optional_success = sum(optional_results)
    optional_total = len(optional_results)
    
    print(f"\nOptional packages: {optional_success}/{optional_total} successful")
    
    # Test basic functionality
    functionality_ok = test_basic_functionality()
    
    print("\nChecking files...")
    pdf_ok = check_pdf_file()
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    
    if core_ok and pdf_ok and functionality_ok:
        print("✓ CORE TESTS PASSED! You can run the parser.")
        print("\nTo run the parser:")
        print("  python parse_book.py")
        
        if optional_success >= optional_total * 0.7:  # 70% of optional packages
            print("\n✓ Most optional packages working - full functionality available")
        else:
            print(f"\n⚠ Only {optional_success}/{optional_total} optional packages working")
            print("  Some advanced features may not be available")
            
    else:
        print("✗ CORE TESTS FAILED")
        if not python_ok:
            print("  - Python version compatibility issues")
        if not core_ok:
            print("  - Core package import failures")
        if not functionality_ok:
            print("  - Basic functionality tests failed")
        if not pdf_ok:
            print("  - PDF file not found")
            
        print("\nTroubleshooting:")
        print("  1. Install missing dependencies:")
        print("     pip install -r requirements.txt")
        print("  2. Make sure the PDF file is in the correct location")
        print("  3. Check Python version compatibility")

if __name__ == "__main__":
    main()
