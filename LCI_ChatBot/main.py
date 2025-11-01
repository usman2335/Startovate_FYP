import os
import sys
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

# Optional dependencies - handle gracefully if not available
try:
    from pymongo import MongoClient
    MONGO_AVAILABLE = True
except ImportError:
    print("⚠️ Warning: pymongo not available. MongoDB features disabled.")
    MONGO_AVAILABLE = False

try:
    sys.path.append('parsed_content')
    from sentence_transformer_search_function import search_chunks_sentence_transformer
    SEARCH_AVAILABLE = True
except ImportError:
    print("⚠️ Warning: sentence transformer search not available. Semantic search disabled.")
    SEARCH_AVAILABLE = False

# ============================
# ⚙️ Configurations
# ============================
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
MISTRAL_MODEL = "mistral-small-latest"
BASE_URL = "https://api.mistral.ai/v1/chat/completions"

# MongoDB setup (if available)
if MONGO_AVAILABLE:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    DB_NAME = os.getenv("DB_NAME", "startovate")
    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
    except Exception as e:
        print(f"⚠️ Warning: Could not connect to MongoDB: {e}")
        MONGO_AVAILABLE = False
else:
    db = None

# Memory
CHAT_HISTORY = []   # list of {"role": "user"/"assistant", "content": "..."}

# ============================
# 🚀 FastAPI Setup
# ============================
app = FastAPI(
    title="LCI ChatBot API (Mistral Hybrid Context)",
    description="FastAPI backend for LCI chatbot using Mistral with hybrid context (template + canvas + semantic search).",
    version="3.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:51722"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================
# 🧠 Helper: Call LLM API
# ============================
def call_llm(provider: str, messages: List[dict], model: Optional[str] = None) -> str:
    if provider.lower() == "mistral":
        headers = {
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": model or MISTRAL_MODEL,
            "messages": messages,
            "temperature": 0.7,
        }
        response = requests.post(BASE_URL, headers=headers, json=payload)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        data = response.json()
        return data["choices"][0]["message"]["content"].strip()
    else:
        raise ValueError(f"Unknown provider: {provider}")

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
   “I’m here to assist only with Lean Canvas for Invention methodology and its templates.”
3. Use existing user data (from templates/canvas) to give personalized, contextual help.
4. Be clear, structured, and professional.
"""

    combined_context = "\n\n".join(context_texts)
    prompt = f"""
{domain_instruction}

User Query:
"{query}"

Relevant Context from Database and LCI Knowledge:
"{combined_context}"
"""

    # Update chat memory
    CHAT_HISTORY.append({"role": "user", "content": prompt})
    recent_history = CHAT_HISTORY[-10:]

    answer = call_llm("mistral", recent_history)
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
        "provider": "mistral",
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

        # 1️⃣ Add Template Context (if MongoDB available)
        if request.templateId and MONGO_AVAILABLE and db is not None:
            try:
                template = db.templates.find_one({"templateId": request.templateId})
                if template:
                    context_texts.append(f"Template Context ({request.templateId}):\n{template.get('content', '')}")
            except Exception as e:
                print(f"Warning: Could not fetch template context: {e}")

        # 2️⃣ Add Canvas Context (if MongoDB available)
        if request.canvasId and MONGO_AVAILABLE and db is not None:
            try:
                canvas = db.canvases.find_one({"canvasId": request.canvasId})
                if canvas:
                    context_texts.append(f"Canvas Overview ({request.canvasId}):\n{canvas}")
            except Exception as e:
                print(f"Warning: Could not fetch canvas context: {e}")

        # 3️⃣ Add Semantic Search Context (if available)
        if SEARCH_AVAILABLE:
            try:
                results = search_chunks_sentence_transformer(query, top_k=request.top_k)
                if results:
                    context_texts += [chunk["text"] for chunk in results]
            except Exception as e:
                print(f"Warning: Could not perform semantic search: {e}")
        
        # 4️⃣ Add basic context information
        if request.canvasId:
            context_texts.append(f"User is working on canvas: {request.canvasId}")
        if request.templateId:
            context_texts.append(f"User is working on template: {request.templateId}")

        # 4️⃣ Generate Answer
        answer = generate_chatbot_response(query, context_texts)

        return ChatResponse(
            query=query,
            answer=answer,
            context_used=context_texts,
            provider="mistral"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
