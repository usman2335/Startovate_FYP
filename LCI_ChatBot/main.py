import os
import sys
import json
from typing import Dict, List, Optional

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
def generate_chatbot_response(
    query: str,
    context_texts: List[str],
    autofill_context: Optional[str] = None
) -> str:
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

    autofill_section = ""
    if autofill_context:
        autofill_section = f"""
Autofill Context:
{autofill_context}
"""

    prompt = f"""
{domain_instruction}

{autofill_section}

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
class AutoFillContext(BaseModel):
    """
    Optional context sent from the auto-fill experience so the chat endpoint
    understands the current template, the user's idea, and any collected answers.
    """
    templateKey: Optional[str] = None
    stepDescription: Optional[str] = None
    ideaDescription: Optional[str] = None
    fieldHints: Optional[Dict[str, str]] = None
    repeatedFields: Optional[List[dict]] = None
    fields: Optional[List[str]] = None
    currentAnswers: Optional[Dict[str, str]] = None
    generatedAnswers: Optional[Dict[str, str]] = None


class ChatRequest(BaseModel):
    query: str
    canvasId: Optional[str] = None
    templateId: Optional[str] = None
    top_k: Optional[int] = 3
    autofillContext: Optional[AutoFillContext] = None


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


def format_autofill_context(context: AutoFillContext) -> str:
    """
    Convert the auto-fill payload data into a readable block so the chat prompt
    can leverage the same information.
    """
    ctx = context.model_dump(exclude_none=True)
    if not ctx:
        return "Auto-fill context was requested but no data was provided."

    parts = []

    template_key = ctx.get("templateKey")
    if template_key:
        parts.append(f"Template Key: {template_key}")

    step_description = ctx.get("stepDescription")
    if step_description:
        parts.append(f"Step Description: {step_description}")

    idea_description = ctx.get("ideaDescription")
    if idea_description:
        parts.append("User Idea / Concept:")
        parts.append(idea_description)

    fields = ctx.get("fields")
    if fields:
        parts.append("Fields Under Consideration:")
        for field in fields:
            parts.append(f"  - {field}")

    field_hints = ctx.get("fieldHints")
    if field_hints:
        parts.append("Field Hints:")
        for name, hint in field_hints.items():
            parts.append(f"  - {name}: {hint}")

    repeated_fields = ctx.get("repeatedFields")
    if repeated_fields:
        parts.append("Repeated Field Patterns:")
        for entry in repeated_fields:
            parts.append(f"  - {entry}")

    current_answers = ctx.get("currentAnswers")
    if current_answers:
        parts.append("Current Answers Provided By User:")
        for name, value in current_answers.items():
            parts.append(f"  - {name}: {value}")

    generated_answers = ctx.get("generatedAnswers")
    if generated_answers:
        parts.append("Previously Generated Auto-Fill Answers:")
        for name, value in generated_answers.items():
            parts.append(f"  - {name}: {value}")

    if not parts:
        return "Auto-fill context payload was empty."

    return "\n".join(parts)

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

        # 4️⃣ Add Auto-Fill Context (if provided)
        autofill_summary = None
        if request.autofillContext:
            autofill_summary = format_autofill_context(request.autofillContext)

        context_used = list(context_texts)
        if autofill_summary:
            context_used.append(f"Auto-Fill Context:\n{autofill_summary}")

        # 5️⃣ Generate Answer
        answer = generate_chatbot_response(query, context_texts, autofill_summary)

        return ChatResponse(
            query=query,
            answer=answer,
            context_used=context_used,
            provider="mistral"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chatbot/auto-fill", response_model=AutoFillResponse)
def auto_fill_endpoint(request: AutoFillRequest):
    """
    Auto-fill template fields using LLM based on context and hints.
    
    This endpoint accepts template information and uses an LLM to generate
    appropriate answers for template fields based on the system prompt,
    step description, field hints, and current answers.
    """
    try:
        # Debug logging
        print(f"📥 Received autofill request:")
        print(f"   - Template Key: {request.templateKey}")
        print(f"   - Idea Description: {'✅ PROVIDED' if request.ideaDescription and request.ideaDescription.strip() else '❌ NOT PROVIDED'}")
        if request.ideaDescription and request.ideaDescription.strip():
            print(f"   - Idea Preview: {request.ideaDescription[:100]}...")
        print(f"   - Fields to fill: {len(request.fieldHints)}")
        
        if not request.fieldHints:
            return AutoFillResponse(
                success=False,
                error="Field hints cannot be empty."
            )
        
        # Construct the prompt for the LLM
        prompt = construct_autofill_prompt(
            template_key=request.templateKey,
            step_description=request.stepDescription,
            idea_description=request.ideaDescription or "",
            field_hints=request.fieldHints,
            repeated_fields=request.repeatedFields or [],
            fields=request.fields
        )
        
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
        print("🔍 DEBUG: Autofill Prompt")
        print("=" * 80)
        print(prompt[:500] + "..." if len(prompt) > 500 else prompt)
        print("=" * 80)
        
        llm_response = call_llm("mistral", messages)
        
        # Parse LLM response as JSON
        try:
            # Remove any potential markdown code blocks
            cleaned_response = llm_response.strip()
            if cleaned_response.startswith("```json"):
                cleaned_response = cleaned_response[7:]
            if cleaned_response.startswith("```"):
                cleaned_response = cleaned_response[3:]
            if cleaned_response.endswith("```"):
                cleaned_response = cleaned_response[:-3]
            cleaned_response = cleaned_response.strip()
            
            # Parse JSON safely
            answers = json.loads(cleaned_response)
            
            # Validate that the response contains the expected fields
            if not isinstance(answers, dict):
                return AutoFillResponse(
                    success=False,
                    error="LLM response is not a valid JSON object."
                )
            
            return AutoFillResponse(
                success=True,
                answers=answers
            )
            
        except json.JSONDecodeError as e:
            print(f"Error parsing LLM response: {e}")
            print(f"Raw LLM response: {llm_response}")
            return AutoFillResponse(
                success=False,
                error=f"Failed to parse LLM response as JSON: {str(e)}"
            )
    
    except HTTPException as e:
        return AutoFillResponse(
            success=False,
            error=f"API Error: {e.detail}"
        )
    
    except Exception as e:
        print(f"Unexpected error in auto_fill_endpoint: {e}")
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
    
    return "\n".join(prompt_parts)
