# LCI ChatBot Startup Script for Windows PowerShell
# This script sets up and runs the LCI ChatBot backend

Write-Host "🚀 Starting LCI ChatBot Backend..." -ForegroundColor Green

# Set the OpenRouter API key
$env:OPENROUTER_API_KEY = "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"

# Navigate to the LCI_ChatBot directory
Set-Location "LCI_ChatBot"

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python is not installed. Please install Python 3.8+ first." -ForegroundColor Red
    exit 1
}

# Check if pip is installed
try {
    pip --version | Out-Null
    Write-Host "✅ pip is available" -ForegroundColor Green
} catch {
    Write-Host "❌ pip is not installed. Please install pip first." -ForegroundColor Red
    exit 1
}

# Install required packages
Write-Host "📦 Installing required packages..." -ForegroundColor Yellow
pip install fastapi uvicorn openai python-dotenv

# Check if the parsed content exists
if (-not (Test-Path "parsed_content")) {
    Write-Host "⚠️  Parsed content directory not found. Please run the parsing scripts first." -ForegroundColor Yellow
    Write-Host "   You can run: python create_sentence_transformer_embeddings.py" -ForegroundColor Yellow
    exit 1
}

# Start the FastAPI server
Write-Host "🌐 Starting FastAPI server on http://localhost:8000" -ForegroundColor Green
Write-Host "📚 API Documentation available at: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "🔍 Health check available at: http://localhost:8000/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
