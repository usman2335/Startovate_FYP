#!/bin/bash

# LCI ChatBot Startup Script
# This script sets up and runs the LCI ChatBot backend

echo "🚀 Starting LCI ChatBot Backend..."

# Set the OpenRouter API key
export OPENROUTER_API_KEY="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"

# Navigate to the LCI_ChatBot directory
cd LCI_ChatBot

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if pip is installed
if ! command -v pip &> /dev/null; then
    echo "❌ pip is not installed. Please install pip first."
    exit 1
fi

# Install required packages
echo "📦 Installing required packages..."
pip install fastapi uvicorn openai python-dotenv

# Check if the parsed content exists
if [ ! -d "parsed_content" ]; then
    echo "⚠️  Parsed content directory not found. Please run the parsing scripts first."
    echo "   You can run: python create_sentence_transformer_embeddings.py"
    exit 1
fi

# Start the FastAPI server
echo "🌐 Starting FastAPI server on http://localhost:8000"
echo "📚 API Documentation available at: http://localhost:8000/docs"
echo "🔍 Health check available at: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop the server"

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
