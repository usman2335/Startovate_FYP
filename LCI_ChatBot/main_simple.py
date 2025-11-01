import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from dotenv import load_dotenv

# ============================
# 🔧 Environment Setup
# ============================
load_dotenv()

# ============================
# ⚙️ Configurations
# ============================
# Use OpenRouter as the primary provider since Mistral might not be available
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "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")
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

# Always use OpenRouter for now since it's more reliable
MISTRAL_MODEL = "meta-llama/llama-3-8b-instruct"
BASE_URL = "https://openrouter.ai/api/v1/chat/completions"
API_KEY = OPENROUTER_API_KEY
PROVIDER = "openrouter"

print(f"🤖 Using {PROVIDER} with model: {MISTRAL_MODEL}")

# Memory for chat history
CHAT_HISTORY = []

# ============================
# 🚀 FastAPI Setup
# ============================
app = FastAPI(
    title="LCI ChatBot API (Simplified)",
    description="Simplified FastAPI backend for LCI chatbot with context support.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================
# 🧠 Helper: Call LLM API
# ============================
def call_llm(messages: List[dict]) -> str:
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    
    payload = {
        "model": MISTRAL_MODEL,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 500
    }
    
    try:
        response = requests.post(BASE_URL, headers=headers, json=payload, timeout=30)
        print(f"API Response Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"API Error: {response.text}")
            raise HTTPException(status_code=response.status_code, detail=f"API Error: {response.text}")
        
        data = response.json()
        return data["choices"][0]["message"]["content"].strip()
    except requests.exceptions.RequestException as e:
        print(f"Request Error: {e}")
        raise HTTPException(status_code=500, detail=f"Request failed: {str(e)}")
    except KeyError as e:
        print(f"Response parsing error: {e}")
        raise HTTPException(status_code=500, detail="Invalid API response format")

# ============================
# 💬 Generate Chatbot Response
# ============================
def generate_chatbot_response(query: str, context_texts: List[str]) -> str:
    domain_instruction = """
You are an AI assistant specialized in the **Lean Canvas for Invention (LCI)** methodology.

Your knowledge base includes:
- LCI book concepts, templates, and methodology
- Step-by-step Lean Canvas completion guidance
- Problem validation and value proposition design
- Commercialization pathways and stakeholder analysis
- Innovation strategy and real-world examples

🧠 Your behavior:
1. Stay within the LCI context.
2. If the user asks something unrelated, respond with:
   "I'm here to assist only with Lean Canvas for Invention methodology and its templates."
3. Use any provided context to give personalized, helpful guidance.
4. Be clear, structured, and professional.
"""

    combined_context = "\n\n".join(context_texts) if context_texts else "No specific context provided."
    
    prompt = f"""
{domain_instruction}

User Query: "{query}"

Context Information: "{combined_context}"

Please provide a helpful response based on the LCI methodology and any provided context.
"""

    # Update chat memory
    CHAT_HISTORY.append({"role": "user", "content": prompt})
    recent_history = CHAT_HISTORY[-10:]  # Keep last 10 messages

    answer = call_llm(recent_history)
    CHAT_HISTORY.append({"role": "assistant", "content": answer})

    return answer

# ============================
# 📬 API Schemas
# ============================
class ChatRequest(BaseModel):
    query: str
    canvasId: Optional[str] = None
    templateId: Optional[str] = None
    top_k: Optional[int] = 3

class ChatResponse(BaseModel):
    query: str
    answer: str
    context_used: Optional[List[str]] = None
    provider: str

# ============================
# 🌐 Endpoints
# ============================
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "provider": PROVIDER,
        "model": MISTRAL_MODEL,
        "chat_memory_size": len(CHAT_HISTORY),
    }

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    query = request.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    try:
        context_texts = []

        # Add context information if provided
        if request.canvasId:
            context_texts.append(f"Canvas Context: User is working on canvas ID {request.canvasId}")
        
        if request.templateId:
            context_texts.append(f"Template Context: User is working on template {request.templateId}")
        
        if request.canvasId and request.templateId:
            context_texts.append(f"Full Context: User is working on template {request.templateId} within canvas {request.canvasId}")

        # Generate response
        answer = generate_chatbot_response(query, context_texts)

        return ChatResponse(
            query=query,
            answer=answer,
            context_used=context_texts,
            provider=PROVIDER
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
