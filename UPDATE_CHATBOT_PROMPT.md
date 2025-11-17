# Update Chatbot Prompt - Make Responses Shorter & Simpler

## What to Do

### Option 1: Manual Update (Recommended)

1. **Open** `LCI_ChatBot/main.py`

2. **Find** the `generate_chatbot_response` function (around line 169)

3. **Replace** the `domain_instruction` variable with this:

```python
    domain_instruction = """
You are a friendly AI assistant for the Lean Canvas for Invention (LCI) methodology.

🎯 Your Communication Style:
- Keep responses SHORT (2-4 sentences max)
- Use SIMPLE language - avoid jargon when possible
- Be DIRECT and to the point
- Break complex ideas into simple steps
- Use bullet points for lists (max 3-4 items)
- Focus on ONE main idea per response

🧠 Your Behavior:
1. Stay within LCI context only
2. If asked about unrelated topics: "I'm here to help with Lean Canvas for Invention only."
3. Use the user's specific idea/data to personalize your help
4. Be conversational and friendly, not formal
5. CRITICAL: You are CHATTING, NOT filling forms or creating tables
6. NEVER use "Field | Answer" format or structured lists
7. Give practical, actionable advice

💡 Response Guidelines:
- Answer the specific question asked
- Don't over-explain or add unnecessary details
- If the user needs more info, they'll ask
- Use examples from their own idea when relevant
- Keep it conversational and easy to understand
"""
```

4. **Also update** the prompt variable to:

```python
    prompt = f"""
{domain_instruction}

User Query:
"{query}"

Context (User's Idea and Current Work):
"{combined_context}"

IMPORTANT: Keep your response SHORT (2-4 sentences), SIMPLE, and DIRECT. Answer only what was asked. Be conversational, not formal.
"""
```

5. **Save** the file

6. **Restart** the Python chatbot:
```bash
cd LCI_ChatBot
python main.py
```

### Option 2: Copy from Reference File

I've created `LCI_ChatBot/chatbot_prompt_update.py` with the complete updated function.

1. Open both files side by side
2. Copy the function from `chatbot_prompt_update.py`
3. Replace the function in `main.py`
4. Save and restart

## What Changed

### Before (Too Long & Complex):
```
"You are an AI assistant specialized in the Lean Canvas for Invention (LCI) methodology.

Your knowledge base includes:
- LCI book concepts, templates, and methodology
- Step-by-step Lean Canvas completion guidance
..."
```

**Result:** Long, formal, complex responses

### After (Short & Simple):
```
"You are a friendly AI assistant for the Lean Canvas for Invention (LCI) methodology.

🎯 Your Communication Style:
- Keep responses SHORT (2-4 sentences max)
- Use SIMPLE language
- Be DIRECT and to the point
..."
```

**Result:** Short, simple, conversational responses

## Key Improvements

✅ **Shorter responses** - 2-4 sentences max
✅ **Simpler language** - No unnecessary jargon
✅ **More direct** - Answers the specific question
✅ **Conversational** - Friendly, not formal
✅ **Focused** - One main idea per response
✅ **Practical** - Actionable advice

## Example Responses

### Before:
**User:** "What should I write in the problem field?"

**Bot:** "The problem field in the Lean Canvas for Invention methodology is designed to capture the core issue that your target customers are facing. When completing this field, you should consider several key aspects: First, identify the specific pain point or challenge that your innovation addresses. This should be a clear, concise statement that describes the problem from the customer's perspective. Second, consider the severity and frequency of the problem - is it a critical issue that occurs regularly, or a minor inconvenience? Third, think about how customers currently deal with this problem and why existing solutions are inadequate. Your problem statement should be specific enough to guide your solution development while being broad enough to encompass your target market. Remember to validate your problem statement through customer interviews and market research to ensure you're addressing a real, significant need."

### After:
**User:** "What should I write in the problem field?"

**Bot:** "Describe the main pain point your customers face in simple terms. For your travel app idea, it could be something like 'People waste hours planning trips and still miss great experiences.' Keep it specific and from the customer's perspective."

## Testing

After updating:

1. **Restart Python chatbot**
2. **Ask a question:** "Help me with problem identification"
3. **Check response length:** Should be 2-4 sentences
4. **Check clarity:** Should be easy to understand
5. **Check relevance:** Should reference your specific idea

## Expected Behavior

✅ Responses are concise (2-4 sentences)
✅ Language is simple and clear
✅ Answers are direct and to the point
✅ Tone is friendly and conversational
✅ References user's specific idea
✅ No unnecessary details or jargon

## If Responses Are Still Too Long

The LLM (Mistral) might still generate long responses. You can:

1. **Add temperature parameter** to make it more focused:
   ```python
   "temperature": 0.5,  # Lower = more focused
   ```

2. **Add max_tokens** to limit response length:
   ```python
   "max_tokens": 150,  # Limit response length
   ```

3. **Emphasize in prompt** even more:
   ```python
   "CRITICAL: Your response MUST be under 100 words. Be extremely concise."
   ```

Let me know if you need help with any of these!
