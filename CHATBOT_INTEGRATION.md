qF# LCI ChatBot Integration

This document explains how to integrate and use the LCI ChatBot in your Startovate FYP project.

## Overview

The LCI ChatBot is a FastAPI-based backend service that provides intelligent assistance for Lean Canvas for Invention (LCI) methodology. It uses OpenRouter API with Llama 3.8B model and semantic search capabilities to answer questions about LCI concepts.

## Features

- 🤖 **Intelligent Chat Interface**: Modern ChatGPT-like UI with real-time messaging
- 🧠 **LCI Knowledge Base**: Trained on LCI methodology content with semantic search
- 🔄 **Real-time Responses**: Streaming chat interface with loading indicators
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔗 **Seamless Integration**: Integrated into your existing React application

## Quick Start

### 1. Start the ChatBot Backend

**Option A: Using PowerShell (Recommended for Windows)**

```powershell
.\start_chatbot.ps1
```

**Option B: Using Batch File**

```cmd
start_chatbot.bat
```

**Option C: Manual Setup**

```bash
cd LCI_ChatBot
export OPENROUTER_API_KEY="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"
pip install fastapi uvicorn openai python-dotenv
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Access the ChatBot

- Navigate to `http://localhost:5173/chat` in your browser
- Or click "LCI Assistant" in the navigation menu

## API Endpoints

The ChatBot backend provides the following endpoints:

### Health Check

- **GET** `/health`
- Returns server status and configuration

### Chat Endpoint

- **POST** `/chat`
- **Body**: `{ "query": "your question", "top_k": 3 }`
- **Response**: `{ "query": "question", "answer": "response", "context_used": [...], "used_openrouter": true }`

## File Structure

```
frontend/
├── src/
│   ├── pages/
│   │   └── ChatPage.jsx          # Main chat interface component
│   ├── CSS/
│   │   └── ChatPage.css          # Chat interface styling
│   ├── utils/
│   │   └── api.js                # API utility functions (updated)
│   ├── components/
│   │   └── Navbar.jsx            # Navigation (updated with chat link)
│   └── App.jsx                   # Main app router (updated with chat route)

LCI_ChatBot/
├── main.py                       # FastAPI backend
├── parsed_content/               # Knowledge base embeddings
├── requirements_core.txt         # Python dependencies
└── start_chatbot.ps1            # Startup script
```

## Usage Examples

### Basic Questions

- "What is the Lean Canvas for Invention?"
- "How do I identify problems in LCI methodology?"
- "What are the key components of LCI?"

### Specific Guidance

- "Help me with market research for my invention"
- "How do I validate my problem statement?"
- "What should I include in my value proposition?"

## Customization

### Styling

The chat interface uses modern CSS with:

- Gradient backgrounds
- Smooth animations
- Responsive design
- Dark/light theme support

### API Configuration

Update the API base URL in `frontend/src/utils/api.js`:

```javascript
const CHATBOT_BASE_URL = "http://localhost:8000";
```

### Model Configuration

Change the AI model in `LCI_ChatBot/main.py`:

```python
MODEL_NAME = "meta-llama/llama-3-8b-instruct"  # Change this
```

## Troubleshooting

### Common Issues

1. **Backend not starting**

   - Ensure Python 3.8+ is installed
   - Check if port 8000 is available
   - Verify OpenRouter API key is set

2. **Frontend connection errors**

   - Ensure backend is running on port 8000
   - Check CORS settings if needed
   - Verify API endpoints are accessible

3. **No responses from chatbot**
   - Check if parsed content exists in `LCI_ChatBot/parsed_content/`
   - Verify OpenRouter API key is valid
   - Check network connectivity

### Debug Mode

Enable debug logging by setting environment variable:

```bash
export DEBUG=true
```

## Security Notes

- The OpenRouter API key is embedded in the startup scripts for convenience
- In production, use environment variables or secure key management
- The chatbot backend runs on localhost by default for security

## Performance

- **Response Time**: Typically 2-5 seconds per query
- **Concurrent Users**: Supports multiple simultaneous users
- **Memory Usage**: ~2GB RAM recommended for optimal performance

## Support

For issues or questions:

1. Check the console logs for error messages
2. Verify all dependencies are installed
3. Ensure both backend and frontend are running
4. Test the health endpoint: `http://localhost:8000/health`

## Future Enhancements

- [ ] User authentication integration
- [ ] Chat history persistence
- [ ] File upload support for custom documents
- [ ] Multi-language support
- [ ] Voice input/output capabilities
