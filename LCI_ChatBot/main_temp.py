import os
import sys
import json
import time
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from dotenv import load_dotenv

# ============================
# ðŸ”§ Environment Setup
# ============================
load_dotenv()

# Optional dependencies - handle gracefully if not available
try:
    from pymongo import MongoClient
    MONGO_AVAILABLE = True
except ImportError:
    print("âš ï¸ Warning: pymongo not available. MongoDB features disabled.")
    MONGO_AVAILABLE = False

try:
    sys.path.append('parsed_content')
    from sentence_transformer_search_function import search_chunks_sentence_transformer
    SEARCH_AVAILABLE = True
except Exception:
    print("âš ï¸ Warning: sentence transformer search not available. Semantic search disabled.")
    SEARCH_AVAILABLE = False

# ============================
# âš™ï¸ Configurations
# ============================
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
MISTRAL_MODEL = "mistral-tiny"
BASE_URL = "https://api.mistral.ai/v1/chat/completions"

# MongoDB setup (if available)
if MONGO_AVAILABLE:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    DB_NAME = os.getenv("DB_NAME", "startovate")
    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
    except Exception as e:
        print(f"âš ï¸ Warning: Could not connect to MongoDB: {e}")
        MONGO_AVAILABLE = False
else:
    db = None

# Memory
CHAT_HISTORY = []   # list of {"role": "user"/"assistant", "content": "..."}

# ============================
# ðŸ” Shared AutoFill Context Store
# ============================
# Keys are typically templateKey (from AutoFillRequest.templateKey), but can be any identifier you want to use
AUTO_CONTEXT = {}
# Example structure:
# AUTO_CONTEXT = {
#     "template_abc": {
#         "ideaDescription": "...",
#         "stepDescription": "...",
#         "fieldHints": {...},
#         "fields": [...],
#         "repeatedFields": [...],
#         "generatedAnswers": {...},
#         "timestamp": 1690000000.0
#     }
# }

# ============================
# ðŸš€ FastAPI Setup
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
# ðŸ§  Helper: Call LLM API
# ============================
def call_llm(provider: str, messages: List[dict], model: Optional[str] = None) -> str:
    print(f"ðŸ” DEBUG call_llm: Called with provider='{provider}', model='{model or MISTRAL_MODEL}', messages_count={len(messages)}")

    if provider.lower() == "mistral":
        # Debug: Check API key
        if not MISTRAL_API_KEY:
            print("âŒ DEBUG call_llm: MISTRAL_API_KEY is not set!")
            raise HTTPException(status_code=500, detail="Mistral API key not configured")

        print(f"ðŸ”‘ DEBUG call_llm: API key is set (length: {len(MISTRAL_API_KEY)})")

        headers = {
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": model or MISTRAL_MODEL,
            "messages": messages,
            "temperature": 0.7,
        }

        print(f"ðŸ“¤ DEBUG call_llm: Sending request to {BASE_URL}")
        print(f"ðŸ“¦ DEBUG call_llm: Payload model={payload['model']}, temperature={payload['temperature']}")

        try:
            response = requests.post(BASE_URL, headers=headers, json=payload, timeout=30)
            print(f"ðŸ“¥ DEBUG call_llm: Response status code: {response.status_code}")

            if response.status_code != 200:
                print(f"âŒ DEBUG call_llm: Error response: {response.text}")
                raise HTTPException(status_code=response.status_code, detail=f"Mistral API error: {response.text}")

            data = response.json()
            print(f"âœ… DEBUG call_llm: Response parsed successfully")

            # Check response structure
            if "choices" not in data:
                print(f"âŒ DEBUG call_llm: 'choices' key missing from response: {data}")
                raise HTTPException(status_code=500, detail="Invalid response structure: missing 'choices'")

            if not data["choices"]:
                print(f"âŒ DEBUG call_llm: 'choices' array is empty: {data}")
                raise HTTPException(status_code=500, detail="Invalid response structure: empty 'choices'")

            if "message" not in data["choices"][0]:
                print(f"âŒ DEBUG call_llm: 'message' key missing from choice: {data['choices'][0]}")
                raise HTTPException(status_code=500, detail="Invalid response structure: missing 'message'")

            if "content" not in data["choices"][0]["message"]:
                print(f"âŒ DEBUG call_llm: 'content' key missing from message: {data['choices'][0]['message']}")
                raise HTTPException(status_code=500, detail="Invalid response structure: missing 'content'")

            content = data["choices"][0]["message"]["content"].strip()
            print(f"ðŸ“ DEBUG call_llm: Extracted content (length: {len(content)})")
            return content

        except requests.exceptions.Timeout:
            print("âŒ DEBUG call_llm: Request timed out")
            raise HTTPException(status_code=500, detail="Mistral API request timed out")
        except requests.exceptions.RequestException as e:
            print(f"âŒ DEBUG call_llm: Request exception: {e}")
            raise HTTPException(status_code=500, detail=f"Mistral API request failed: {str(e)}")
        except ValueError as e:
            print(f"âŒ DEBUG call_llm: JSON parsing error: {e}")
            raise HTTPException(status_code=500, detail=f"Invalid JSON response from Mistral API: {str(e)}")

    else:
        print(f"âŒ DEBUG call_llm: Unknown provider: {provider}")
        raise ValueError(f"Unknown provider: {provider}")

# ============================
# ðŸ’¬ Generate Chatbot Response
# ============================
def generate_chatbot_response(query: str, context_texts: List[str]) -> str:
    domain_instruction = """
You are an AI assistant specialized in the **Lean Canvas for Invention (LCI)** methodology.
