@echo off
echo 🚀 Starting LCI ChatBot Backend (Simplified)...

REM Set the API key
set OPENROUTER_API_KEY=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

REM Navigate to the LCI_ChatBot directory
cd LCI_ChatBot

REM Install minimal required packages
echo 📦 Installing required packages...
pip install fastapi uvicorn python-dotenv requests

REM Start the FastAPI server with simplified version
echo 🌐 Starting FastAPI server on http://localhost:8000
echo 📚 API Documentation available at: http://localhost:8000/docs
echo 🔍 Health check available at: http://localhost:8000/health
echo ""
echo Press Ctrl+C to stop the server

uvicorn main_simple:app --host 0.0.0.0 --port 8000 --reload
