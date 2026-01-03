import psutil
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
# 🔧 Environment Setup
# ============================
load_dotenv()

def log_memory(stage=""):
    process = psutil.Process(os.getpid())
    mem = process.memory_info()
    print(f"[MEMORY] {stage} - RSS: {mem.rss / 1024**2:.2f} MB, VMS: {mem.vms / 1024**2:.2f} MB")

# ============================
# 🚀 Auto-Start Qdrant & Setup Embeddings
# ============================
def initialize_qdrant_and_embeddings():
    """Initialize Qdrant server and embeddings"""
    try:
        # Step 1: Start Qdrant server if needed
        from qdrant_server_manager import start_qdrant_if_needed
        print("🔍 Ensuring Qdrant server is running...")
        
        if not start_qdrant_if_needed():
            print("❌ Failed to start Qdrant server")
            return False
        
        # Step 2: Setup embeddings if needed
        from auto_setup import run_auto_setup
        print("🔍 Checking if embeddings setup is needed...")
        
        # Check if embeddings exist
        from auto_setup import check_embeddings_exist
        if not check_embeddings_exist():
            print("📦 Running automatic embeddings setup...")
            success = run_auto_setup()
            if not success:
                print("❌ Auto-setup failed - chatbot will run without LCI knowledge")
                return False
        else:
            print("✅ Embeddings already available")
        
        print("🎉 Qdrant and embeddings ready!")
        return True
        
    except Exception as e:
        print(f"⚠️ Initialization error: {e}")
        print("💡 Chatbot will run without LCI knowledge - manual setup may be needed")
        return False

# Optional dependencies - handle gracefully if not available
try:
    from pymongo import MongoClient
    MONGO_AVAILABLE = True
except ImportError:
    print("⚠️ Warning: pymongo not available. MongoDB features disabled.")
    MONGO_AVAILABLE = False

try:
    # Using Qdrant for semantic search
    # NOTE: Model (all-MiniLM-L6-v2, 384-dim) is lazy-loaded on first search, not at startup
    # This reduces RAM usage - model will be cached after first load for fast subsequent searches
    from qdrant_search import search_chunks_qdrant as search_chunks_sentence_transformer
    SEARCH_AVAILABLE = True
    print("✅ Using Qdrant for semantic search (lazy-loaded model)")
    
    # Initialize Qdrant server and embeddings
    initialize_qdrant_and_embeddings()
    
except Exception as e:
    print(f"❌ Error: Qdrant not available: {e}")
    print("💡 Make sure Qdrant is configured in .env and running")
    SEARCH_AVAILABLE = False

# ============================
# ⚙️ Configurations
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
        print(f"⚠️ Warning: Could not connect to MongoDB: {e}")
        MONGO_AVAILABLE = False
else:
    db = None

# Memory - Per-user chat history
CHAT_HISTORY = {}   # dict of {user_id: [{"role": "user"/"assistant", "content": "..."}]}

# ============================
# 🔁 Shared AutoFill Context Store
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
# 🚀 FastAPI Setup
# ============================
app = FastAPI(
    title="LCI ChatBot API (Mistral Hybrid Context)",
    description="FastAPI backend for LCI chatbot using Mistral with hybrid context (template + canvas + semantic search).",
    version="3.0.0",
)
log_memory("After FastAPI startup")

# Add shutdown handler for Qdrant server
@app.on_event("shutdown")
def shutdown_event():
    """Gracefully shutdown Qdrant server when FastAPI shuts down"""
    try:
        from qdrant_server_manager import stop_qdrant
        stop_qdrant()
    except Exception as e:
        print(f"⚠️ Error during shutdown: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:51722", "https://startovate-frontend.pages.dev"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================
# 🧠 Helper: Call LLM API
# ============================
def call_llm(provider: str, messages: List[dict], model: Optional[str] = None) -> str:
    log_memory("Before LLM call")

    print(f"🔍 DEBUG call_llm: Called with provider='{provider}', model='{model or MISTRAL_MODEL}', messages_count={len(messages)}")

    if provider.lower() == "mistral":
        # Debug: Check API key
        if not MISTRAL_API_KEY:
            print("❌ DEBUG call_llm: MISTRAL_API_KEY is not set!")
            raise HTTPException(status_code=500, detail="Mistral API key not configured")

        print(f"🔑 DEBUG call_llm: API key is set (length: {len(MISTRAL_API_KEY)})")

        headers = {
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": model or MISTRAL_MODEL,
            "messages": messages,
            "temperature": 0.7,
        }

        print(f"📤 DEBUG call_llm: Sending request to {BASE_URL}")
        print(f"📦 DEBUG call_llm: Payload model={payload['model']}, temperature={payload['temperature']}")

        try:
            response = requests.post(BASE_URL, headers=headers, json=payload, timeout=30)
            print(f"📥 DEBUG call_llm: Response status code: {response.status_code}")

            if response.status_code != 200:
                print(f"❌ DEBUG call_llm: Error response: {response.text}")
                raise HTTPException(status_code=response.status_code, detail=f"Mistral API error: {response.text}")

            data = response.json()
            print(f"✅ DEBUG call_llm: Response parsed successfully")

            # Check response structure
            if "choices" not in data:
                print(f"❌ DEBUG call_llm: 'choices' key missing from response: {data}")
                raise HTTPException(status_code=500, detail="Invalid response structure: missing 'choices'")

            if not data["choices"]:
                print(f"❌ DEBUG call_llm: 'choices' array is empty: {data}")
                raise HTTPException(status_code=500, detail="Invalid response structure: empty 'choices'")

            if "message" not in data["choices"][0]:
                print(f"❌ DEBUG call_llm: 'message' key missing from choice: {data['choices'][0]}")
                raise HTTPException(status_code=500, detail="Invalid response structure: missing 'message'")

            if "content" not in data["choices"][0]["message"]:
                print(f"❌ DEBUG call_llm: 'content' key missing from message: {data['choices'][0]['message']}")
                raise HTTPException(status_code=500, detail="Invalid response structure: missing 'content'")

            content = data["choices"][0]["message"]["content"].strip()
            print(f"📝 DEBUG call_llm: Extracted content (length: {len(content)})")
            log_memory("After LLM call")

            return content

        except requests.exceptions.Timeout:
            print("❌ DEBUG call_llm: Request timed out")
            raise HTTPException(status_code=500, detail="Mistral API request timed out")
        except requests.exceptions.RequestException as e:
            print(f"❌ DEBUG call_llm: Request exception: {e}")
            raise HTTPException(status_code=500, detail=f"Mistral API request failed: {str(e)}")
        except ValueError as e:
            print(f"❌ DEBUG call_llm: JSON parsing error: {e}")
            raise HTTPException(status_code=500, detail=f"Invalid JSON response from Mistral API: {str(e)}")

    else:
        print(f"❌ DEBUG call_llm: Unknown provider: {provider}")
        raise ValueError(f"Unknown provider: {provider}")

# ============================
# 💬 Generate Chatbot Response
# ============================
def generate_chatbot_response(query: str, context_texts: List[str], user_id: str = "default") -> str:
    print(f"🤖 [GENERATE] Starting chatbot response generation...")
    print(f"   - Query: {query[:50]}...")
    print(f"   - User ID: {user_id}")
    print(f"   - Context texts count: {len(context_texts)}")

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
   "I'm here to assist only with Lean Canvas for Invention methodology and its templates."
3. Use existing user data (from templates/canvas) to give personalized, contextual help.
4. Be CONCISE - answer with just enough detail to be helpful, no more. One clear paragraph is usually enough.
5. Use bullet points for lists.
6. Avoid unnecessary elaboration - get straight to the point.
"""

    print("🤖 [GENERATE] Building prompt...")
    combined_context = "\n\n".join(context_texts)
    prompt = f"""
{domain_instruction}

User Query:
"{query}"

Relevant Context from Database and LCI Knowledge:
"{combined_context}"

IMPORTANT: Keep your response concise - just enough to answer the question clearly. One paragraph is usually sufficient.
"""
    print(f"   - Prompt length: {len(prompt)}")

    print("🤖 [GENERATE] Updating chat history...")
    # Initialize user's chat history if not exists
    if user_id not in CHAT_HISTORY:
        CHAT_HISTORY[user_id] = []
        print(f"   - Created new chat history for user: {user_id}")

    # Update user's chat memory
    CHAT_HISTORY[user_id].append({"role": "user", "content": prompt})
    recent_history = CHAT_HISTORY[user_id][-10:]  # Last 10 messages for this user
    print(f"   - Chat history updated, recent messages: {len(recent_history)}")

    print("🤖 [GENERATE] Calling LLM...")
    answer = call_llm("mistral", recent_history)
    print(f"✅ [GENERATE] LLM call completed (answer length: {len(answer)})")

    CHAT_HISTORY[user_id].append({"role": "assistant", "content": answer})
    print("✅ [GENERATE] Response generation completed")

    return answer

# ============================
# 📬 API Schemas
# ============================
class ChatRequest(BaseModel):
    query: str
    userId: Optional[str] = None
    canvasId: Optional[str] = None
    templateId: Optional[str] = None
    templateKey: Optional[str] = None
    stepDescription: Optional[str] = None
    ideaDescription: Optional[str] = None
    fieldHints: Optional[dict] = None
    currentAnswers: Optional[dict] = None
    top_k: Optional[int] = 3

class ChatResponse(BaseModel):
    query: str
    answer: str
    context_used: Optional[List[str]] = None
    provider: str

class AutoFillRequest(BaseModel):
    templateKey: str
    stepDescription: str
    ideaDescription: Optional[str] = ""
    fields: List[str]
    fieldHints: dict
    repeatedFields: Optional[List[dict]] = []

class AutoFillResponse(BaseModel):
    success: bool
    answers: Optional[dict] = None
    error: Optional[str] = None

# ============================
# 🌐 Endpoints
# ============================
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "provider": "mistral",
        "model": MISTRAL_MODEL,
        "active_users": len(CHAT_HISTORY),
        "total_messages": sum(len(history) for history in CHAT_HISTORY.values()),
        "autofill_context_count": len(AUTO_CONTEXT),
    }

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    print("🚀 [CHAT START] Received chat request")
    print(f"   - Query: {request.query[:100]}...")
    print(f"   - User ID: {request.userId}")
    print(f"   - Canvas ID: {request.canvasId}")
    print(f"   - Template ID: {request.templateId}")
    print(f"   - Template Key: {request.templateKey}")

    query = request.query.strip()
    print(f"📝 [CHAT] Validating query...")
    print(f"📝 [CHAT] Validating query...")
    if not query:
        print("❌ [CHAT] Query validation failed: empty query")
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    print("✅ [CHAT] Query validation passed")

    try:
        context_texts = []
        print("📚 [CHAT] Starting context collection...")

        # 1️⃣ Add Template-Specific Context (Step Description, Idea, Field Hints, Current Answers)
        # This is the SAME context that autofill uses - now available to chat!
        print("📋 [CHAT] Adding template-specific context...")
        if request.stepDescription:
            context_texts.append(f"📋 CURRENT STEP DESCRIPTION:\n{request.stepDescription}")
            print(f"✅ [CHAT] Added step description to chat context")
        else:
            print("⚠️ [CHAT] No step description provided")

        if request.ideaDescription:
            context_texts.append(f"💡 USER'S IDEA/BUSINESS CONCEPT:\n{request.ideaDescription}")
            print(f"✅ [CHAT] Added idea description to chat context")
        else:
            print("⚠️ [CHAT] No idea description provided")

        if request.fieldHints:
            hints_text = "\n".join([f"  - {field}: {hint}" for field, hint in request.fieldHints.items()])
            context_texts.append(f"📝 TEMPLATE FIELDS:\n{hints_text}")
            print(f"✅ [CHAT] Added {len(request.fieldHints)} field hints to chat context")
        else:
            print("⚠️ [CHAT] No field hints provided")

        if request.currentAnswers:
            answers_text = "\n".join([f"  - {field}: {value}" for field, value in request.currentAnswers.items() if value])
            if answers_text:
                context_texts.append(f"✍️ USER'S CURRENT ANSWERS:\n{answers_text}")
                print(f"✅ [CHAT] Added {len([v for v in request.currentAnswers.values() if v])} current answers to chat context")
        else:
            print("⚠️ [CHAT] No current answers provided")

        # 2️⃣ Add Template Context (if MongoDB available)
        print(f"📄 [CHAT] Checking MongoDB template context...")
        print(f"   - MONGO_AVAILABLE: {MONGO_AVAILABLE}")
        print(f"   - db is not None: {db is not None}")
        print(f"   - templateId: {request.templateId}")

        if request.templateId and MONGO_AVAILABLE and db is not None:
            try:
                print(f"📄 [CHAT] Fetching template from MongoDB: {request.templateId}")
                template = db.templates.find_one({"templateId": request.templateId})
                if template:
                    context_texts.append(f"Template Context ({request.templateId}):\n{template.get('content', '')}")
                    print(f"✅ [CHAT] Template context added successfully")
                else:
                    print(f"⚠️ [CHAT] Template not found in MongoDB: {request.templateId}")
            except Exception as e:
                print(f"❌ [CHAT] Error fetching template context: {e}")
        else:
            print(f"⚠️ [CHAT] MongoDB template context skipped")

        # 3️⃣ Add Canvas Context (if MongoDB available)
        print(f"🎨 [CHAT] Checking MongoDB canvas context...")
        if request.canvasId and MONGO_AVAILABLE and db is not None:
            try:
                print(f"🎨 [CHAT] Fetching canvas from MongoDB: {request.canvasId}")
                canvas = db.canvases.find_one({"canvasId": request.canvasId})
                if canvas:
                    context_texts.append(f"Canvas Overview ({request.canvasId}):\n{canvas}")
                    print(f"✅ [CHAT] Canvas context added successfully")
                else:
                    print(f"⚠️ [CHAT] Canvas not found in MongoDB: {request.canvasId}")
            except Exception as e:
                print(f"❌ [CHAT] Error fetching canvas context: {e}")
        else:
            print(f"⚠️ [CHAT] MongoDB canvas context skipped")

        # 4️⃣ Add Semantic Search Context (if available)
        print(f"🔍 [CHAT] Checking semantic search...")
        print(f"   - SEARCH_AVAILABLE: {SEARCH_AVAILABLE}")
        print(f"   - top_k: {request.top_k}")

        if SEARCH_AVAILABLE:
            print(f"🔍 [CHAT] Performing semantic search with top_k={request.top_k}")
            log_memory("Before semantic search")
            try:
                print(f"🔍 [CHAT] Performing semantic search for query: {query[:50]}...")
                results = search_chunks_sentence_transformer(query, top_k=request.top_k)
                if results:
                    context_texts += [chunk["text"] for chunk in results]
                    print(f"✅ [CHAT] Semantic search completed, found {len(results)} results")
                else:
                    print(f"⚠️ [CHAT] Semantic search completed, no results found")
            except Exception as e:
                print(f"❌ [CHAT] Error performing semantic search: {e}")
        else:
            print(f"⚠️ [CHAT] Semantic search skipped")
        
        # 5️⃣ Add basic context information
        print("📋 [CHAT] Adding basic context information...")
        if request.canvasId:
            context_texts.append(f"User is working on canvas: {request.canvasId}")
            print(f"✅ [CHAT] Added canvas context: {request.canvasId}")
        if request.templateId:
            context_texts.append(f"User is working on template: {request.templateId}")
            print(f"✅ [CHAT] Added template context: {request.templateId}")
        if request.templateKey:
            context_texts.append(f"User is working on template: {request.templateKey}")
            print(f"✅ [CHAT] Added template key context: {request.templateKey}")

        # 6️⃣ Add AutoFill Shared Context if present (from previous autofill operations)
        # Check by templateKey first (most specific), then templateId, then canvasId
        print("🔁 [CHAT] Checking autofill context...")
        print(f"   - AUTO_CONTEXT keys: {list(AUTO_CONTEXT.keys())}")
        added_autofill = False

        if request.templateKey and request.templateKey in AUTO_CONTEXT:
            try:
                print(f"🔁 [CHAT] Loading autofill context for templateKey: {request.templateKey}")
                ctx = AUTO_CONTEXT[request.templateKey]
                pretty = json.dumps(ctx, indent=2)
                context_texts.append(f"PREVIOUS AUTOFILL CONTEXT (templateKey={request.templateKey}):\n{pretty}")
                added_autofill = True
                print(f"✅ [CHAT] Loaded autofill context for templateKey={request.templateKey}")
            except Exception as e:
                print(f"❌ [CHAT] Error loading autofill context for templateKey={request.templateKey}: {e}")

        if not added_autofill and request.templateId and request.templateId in AUTO_CONTEXT:
            try:
                print(f"🔁 [CHAT] Loading autofill context for templateId: {request.templateId}")
                ctx = AUTO_CONTEXT[request.templateId]
                pretty = json.dumps(ctx, indent=2)
                context_texts.append(f"PREVIOUS AUTOFILL CONTEXT (templateId={request.templateId}):\n{pretty}")
                added_autofill = True
                print(f"✅ [CHAT] Loaded autofill context for templateId={request.templateId}")
            except Exception as e:
                print(f"❌ [CHAT] Error loading autofill context for templateId={request.templateId}: {e}")

        if not added_autofill and request.canvasId and request.canvasId in AUTO_CONTEXT:
            try:
                print(f"🔁 [CHAT] Loading autofill context for canvasId: {request.canvasId}")
                ctx = AUTO_CONTEXT[request.canvasId]
                pretty = json.dumps(ctx, indent=2)
                context_texts.append(f"PREVIOUS AUTOFILL CONTEXT (canvasId={request.canvasId}):\n{pretty}")
                added_autofill = True
                print(f"✅ [CHAT] Loaded autofill context for canvasId={request.canvasId}")
            except Exception as e:
                print(f"❌ [CHAT] Error loading autofill context for canvasId={request.canvasId}: {e}")

        if not added_autofill:
            print("⚠️ [CHAT] No autofill context found")

        # 7️⃣ Generate Answer
        print("🧠 [CHAT] Starting answer generation...")
        print(f"   - Context texts count: {len(context_texts)}")
        user_id = request.userId or request.canvasId or "default"
        print(f"   - User ID: {user_id}")
        answer = generate_chatbot_response(query, context_texts, user_id)
        print("✅ [CHAT] Answer generation completed")

        print("📤 [CHAT] Preparing response...")
        response = ChatResponse(
            query=query,
            answer=answer,
            context_used=context_texts,
            provider="mistral"
        )
        print(f"✅ [CHAT END] Request completed successfully - answer length: {len(answer)}")
        return response

    except HTTPException as he:
        print(f"❌ [CHAT END] HTTP exception re-raised: {he.detail}")
        raise he
    except Exception as e:
        print(f"❌ [CHAT END] Unexpected error in chat endpoint: {str(e)}")
        print(f"   - Error type: {type(e).__name__}")
        import traceback
        print(f"   - Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chatbot/auto-fill", response_model=AutoFillResponse)
def auto_fill_endpoint(request: AutoFillRequest):
    """
    Auto-fill template fields using LLM based on context and hints.


    This endpoint accepts template information and uses an LLM to generate
    appropriate answers for template fields based on the system prompt,
    step description, field hints, and current answers.
    """
    print("🔄 [AUTOFILL START] Received autofill request")
    print(f"   - Template Key: {request.templateKey}")
    print(f"   - Step Description: {request.stepDescription[:50] if request.stepDescription else 'None'}...")
    print(f"   - Idea Description: {'✅ PROVIDED' if request.ideaDescription and request.ideaDescription.strip() else '❌ NOT PROVIDED'}")
    if request.ideaDescription and request.ideaDescription.strip():
        print(f"   - Idea Preview: {request.ideaDescription[:100]}...")
    print(f"   - Fields to fill: {len(request.fieldHints)}")
    print(f"   - Fields: {list(request.fieldHints.keys()) if request.fieldHints else []}")

    try:
        print("🔍 [AUTOFILL] Validating request...")
        
        if not request.fieldHints:
            print("❌ [AUTOFILL] Validation failed: No field hints")
            return AutoFillResponse(
                success=False,
                error="Field hints cannot be empty."
            )

        if not request.templateKey:
            print("❌ [AUTOFILL] Validation failed: No template key")
            return AutoFillResponse(
                success=False,
                error="Template key cannot be empty."
            )

        print("✅ [AUTOFILL] Validation passed")
        print("📝 [AUTOFILL] Constructing prompt...")

        # Construct the prompt for the LLM
        prompt = construct_autofill_prompt(
            template_key=request.templateKey,
            step_description=request.stepDescription,
            idea_description=request.ideaDescription or "",
            field_hints=request.fieldHints,
            repeated_fields=request.repeatedFields or [],
            fields=request.fields
        )
        print(f"✅ [AUTOFILL] Prompt construction completed (length: {len(prompt)})")
        
        # Prepare system message - emphasize idea context if available
        system_content = """You are an AI assistant helping to autofill a Lean Canvas for Invention (LCI) template.

CRITICAL REQUIREMENT: If the user provides their idea/business concept, you MUST base ALL your answers specifically on that idea. Do NOT generate generic or random answers.

Your task:
1. Carefully read and understand the user's idea/business concept
2. Generate answers that are directly relevant and specific to their idea
3. Be concise, relevant, and business-focused
4. Only fill in fields that are empty or null
5. Maintain consistency with the user's idea throughout all answers

Remember: Every answer should clearly relate to the specific business idea provided by the user."""
        
        # Call LLM to generate answers
        messages = [
            {
                "role": "system",
                "content": system_content
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
        
        # Debug logging
        print("=" * 80)
        print("🔍 [AUTOFILL] Autofill Prompt")
        print("=" * 80)
        print(prompt[:500] + "..." if len(prompt) > 500 else prompt)
        print("=" * 80)

        print("🤖 [AUTOFILL] Calling LLM...")
        llm_response = call_llm("mistral", messages)
        print(f"✅ [AUTOFILL] LLM call completed (response length: {len(llm_response)})")
        print(f"📄 [AUTOFILL] LLM response preview: {llm_response[:200]}...")

        print("🔄 [AUTOFILL] Parsing LLM response...")
        
        # Parse LLM response as JSON
        try:
            print("🧹 [AUTOFILL] Cleaning LLM response...")
            # Remove any potential markdown code blocks
            cleaned_response = llm_response.strip()
            if cleaned_response.startswith("```json"):
                cleaned_response = cleaned_response[7:]
            if cleaned_response.startswith("```"):
                cleaned_response = cleaned_response[3:]
            if cleaned_response.endswith("```"):
                cleaned_response = cleaned_response[:-3]
            cleaned_response = cleaned_response.strip()

            print("📄 [AUTOFILL] Parsing JSON...")
            print(f"   - Cleaned response preview: {cleaned_response[:100]}...")

            # Parse JSON safely
            answers = json.loads(cleaned_response)
            print("✅ [AUTOFILL] JSON parsed successfully")
            print(f"   - Answer keys: {list(answers.keys()) if isinstance(answers, dict) else 'Not a dict'}")

            # Validate that the response contains the expected fields
            if not isinstance(answers, dict):
                print("❌ [AUTOFILL] Validation failed: Not a dictionary")
                return AutoFillResponse(
                    success=False,
                    error="LLM response is not a valid JSON object."
                )
            
            print("✅ [AUTOFILL] Response validation passed")
            print("💾 [AUTOFILL] Saving autofill context...")

            # ---------------------------
            # SAVE AUTO-FILL CONTEXT HERE
            # ---------------------------
            try:
                AUTO_CONTEXT[request.templateKey] = {
                    "ideaDescription": request.ideaDescription,
                    "stepDescription": request.stepDescription,
                    "fieldHints": request.fieldHints,
                    "fields": request.fields,
                    "repeatedFields": request.repeatedFields or [],
                    "generatedAnswers": answers,
                    "timestamp": time.time()
                }
                print(f"✅ [AUTOFILL] Saved autofill context under key: {request.templateKey}")
            except Exception as e:
                print(f"❌ [AUTOFILL] Error saving autofill context: {e}")

            print("📤 [AUTOFILL] Preparing success response...")
            return AutoFillResponse(
                success=True,
                answers=answers
            )
            
        except json.JSONDecodeError as e:
            print(f"❌ [AUTOFILL END] JSON parsing failed: {e}")
            print(f"   - Raw LLM response: {llm_response[:500]}...")
            return AutoFillResponse(
                success=False,
                error=f"Failed to parse LLM response as JSON: {str(e)}"
            )


    except HTTPException as e:
        print(f"❌ [AUTOFILL END] HTTP exception: {e.detail}")
        print(f"❌ [AUTOFILL END] HTTP exception: {e.detail}")
        return AutoFillResponse(
            success=False,
            error=f"API Error: {e.detail}"
        )


    except Exception as e:
        print(f"❌ [AUTOFILL END] Unexpected error in autofill endpoint: {str(e)}")
        print(f"   - Error type: {type(e).__name__}")
        import traceback
        print(f"   - Traceback: {traceback.format_exc()}")
        return AutoFillResponse(
            success=False,
            error=f"An unexpected error occurred: {str(e)}"
        )

def construct_autofill_prompt(
    template_key: str,
    step_description: str,
    idea_description: str,
    field_hints: dict,
    repeated_fields: List[dict],
    fields: List[str]
) -> str:
    """
    Construct a detailed prompt for the LLM to generate template answers.


    Args:
        template_key: The unique identifier for the template
        step_description: Description of the current step/template
        idea_description: Description of the user's idea/business concept
        field_hints: Dictionary of field names and their descriptions/hints
        repeated_fields: List of repeated field patterns (e.g., for dynamic sections)
        fields: List of fields to fill


    Returns:
        A formatted prompt string for the LLM
    """
    print(f"📝 [CONSTRUCT_PROMPT] Building prompt for template: {template_key}")
    print(f"   - Idea provided: {'Yes' if idea_description and idea_description.strip() else 'No'}")
    print(f"   - Fields to fill: {len(field_hints)}")
    print(f"   - Field names: {list(field_hints.keys())}")

    prompt_parts = []
    
    # Add template information
    prompt_parts.append(f"TEMPLATE: {template_key}")
    prompt_parts.append(f"STEP DESCRIPTION: {step_description}\n")
    
    # Add idea description as context if available - MAKE IT PROMINENT
    if idea_description and idea_description.strip():
        prompt_parts.append("=" * 80)
        prompt_parts.append("🎯 USER'S IDEA/BUSINESS CONCEPT (USE THIS AS PRIMARY CONTEXT):")
        prompt_parts.append("=" * 80)
        prompt_parts.append(f"{idea_description.strip()}")
        prompt_parts.append("=" * 80)
        prompt_parts.append("")
    
    # Add current answers as context
    if fields:
        prompt_parts.append("FIELDS (for context):")
        for field in fields:
            prompt_parts.append(f"  - {field}")
        prompt_parts.append("")
    
    # Add field hints
    prompt_parts.append("FIELDS TO FILL:")
    for field_name, hint in field_hints.items():
        prompt_parts.append(f"  - {field_name}: {hint} (currently empty)")
    prompt_parts.append("")
    
    # Add repeated fields information if present
    if repeated_fields:
        prompt_parts.append("REPEATED FIELD PATTERNS:")
        for rf in repeated_fields:
            prompt_parts.append(f"  - {rf}")
        prompt_parts.append("")
    
    # Add instructions
    prompt_parts.append("INSTRUCTIONS:")
    if idea_description and idea_description.strip():
        prompt_parts.append("1. ⚠️ CRITICAL: All your answers MUST be directly based on the USER'S IDEA/BUSINESS CONCEPT provided above.")
        prompt_parts.append("2. ⚠️ CRITICAL: Do NOT generate generic or random answers. Everything must be specific to the user's idea.")
        prompt_parts.append("3. Analyze the user's idea carefully and tailor each field to match their specific business concept.")
        prompt_parts.append("4. Use the current answers as context to maintain consistency with the user's idea.")
        prompt_parts.append("5. If a field already has a value, improve it while staying true to the user's concept.")
        prompt_parts.append("6. Make the answers specific, relevant, and professional - always aligned with the user's idea.")
        prompt_parts.append("7. For repeated fields, generate multiple instances that fit the user's business concept.")
        prompt_parts.append("8. Return ONLY a JSON object with field names as keys and generated values as values.")
        prompt_parts.append("9. Do NOT include any explanations, markdown formatting, or code blocks.")
        prompt_parts.append("10. Ensure the JSON is valid and properly formatted.")
    else:
        prompt_parts.append("1. Generate appropriate values for all fields listed above.")
        prompt_parts.append("2. Use the current answers as context to maintain consistency.")
        prompt_parts.append("3. If a field already has a value, you may improve it or keep it as is.")
        prompt_parts.append("4. Make the answers specific, relevant, and professional.")
        prompt_parts.append("5. For repeated fields, generate multiple instances if appropriate.")
        prompt_parts.append("6. Return ONLY a JSON object with field names as keys and generated values as values.")
        prompt_parts.append("7. Do NOT include any explanations, markdown formatting, or code blocks.")
        prompt_parts.append("8. Ensure the JSON is valid and properly formatted.")
    prompt_parts.append("")
    prompt_parts.append("Example format:")
    prompt_parts.append('{')
    prompt_parts.append('  "fieldName1": "generated value 1",')
    prompt_parts.append('  "fieldName2": "generated value 2"')
    prompt_parts.append('}')
    prompt_parts.append("")
    prompt_parts.append("Now generate the JSON response:")

    result = "\n".join(prompt_parts)
    print(f"✅ [CONSTRUCT_PROMPT] Prompt construction completed, length: {len(result)}")
    return result
