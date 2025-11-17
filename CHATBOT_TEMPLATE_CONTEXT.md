# Chatbot Template Context Integration

## Overview
The chatbot now receives the **same rich context** that the auto-fill feature uses when users are working on templates. This allows the chatbot to provide more relevant, personalized assistance based on:

- The current step description
- The user's idea/business concept
- Template field hints and descriptions
- Current answers the user has already filled in

## What Changed

### 1. Python Backend (`LCI_ChatBot/main.py`)
- **Updated `ChatRequest` schema** to accept:
  - `templateKey`: Template identifier (e.g., "ProblemIdentification-Step3")
  - `stepDescription`: Description of the current step
  - `ideaDescription`: User's business idea/concept
  - `fieldHints`: Dictionary of field names and their descriptions
  - `currentAnswers`: User's current answers

- **Enhanced `/chat` endpoint** to:
  - Use step description, idea, field hints, and current answers as context
  - Prioritize template-specific context over generic context
  - Maintain backward compatibility (all new fields are optional)

### 2. Node.js Backend (`backend/src/controllers/chatbotController.js`)
- **Enhanced `sendChatMessage` controller** to:
  - Accept template context from frontend
  - Fetch step description from database using `templateKey`
  - Fetch idea description from canvas
  - Forward all context to Python chatbot

### 3. Frontend API (`frontend/src/utils/api.js`)
- **Updated `sendChatMessage` function** to:
  - Accept `templateContext` parameter
  - Send template-specific data to backend

### 4. Chatbot Context (`frontend/src/context/chatbotContext.jsx`)
- **Enhanced context provider** to:
  - Store template-specific data (templateKey, fieldHints, currentAnswers)
  - Provide `getTemplateContext()` method
  - Persist template context in sessionStorage

### 5. Template Component (`frontend/src/components/Templates/TemplateComponent.jsx`)
- **Updated to set template context** when:
  - Template loads
  - User updates answers
  - This ensures chatbot always has latest context

### 6. Floating Chat (`frontend/src/components/FloatingChat.jsx`)
- **Updated to send template context** with every message

## How It Works

### When User is on a Template Page:

1. **TemplateComponent** sets context with:
   ```javascript
   setContext(canvasId, templateKey, null, {
     templateKey: "ProblemIdentification-Step3",
     fieldHints: { "problem": "Describe the problem...", ... },
     currentAnswers: { "problem": "Users struggle with...", ... }
   });
   ```

2. **FloatingChat** retrieves and sends this context:
   ```javascript
   const templateContext = getTemplateContext();
   sendChatMessage(query, 3, context, templateContext);
   ```

3. **Node.js Backend** enriches the request:
   - Fetches step description from database
   - Fetches idea description from canvas
   - Forwards everything to Python chatbot

4. **Python Chatbot** uses all context to generate relevant responses:
   - Understands what step the user is on
   - Knows the user's business idea
   - Sees what fields need to be filled
   - Knows what the user has already answered

## Benefits

✅ **Personalized Responses**: Chatbot answers are specific to the user's idea and current work
✅ **Context-Aware**: Chatbot understands which template step the user is on
✅ **Consistent Experience**: Same context used for both auto-fill and chat
✅ **Better Assistance**: Chatbot can reference user's current answers and provide targeted help
✅ **Backward Compatible**: Works with or without template context

## Example Scenarios

### Before (Generic Response):
**User**: "Help me with the problem field"
**Chatbot**: "The problem field should describe the main issue your target customers face..."

### After (Context-Aware Response):
**User**: "Help me with the problem field"
**Chatbot**: "Based on your idea about [user's idea], the problem field should focus on [specific guidance]. I see you've already identified [references current answers]. Consider expanding on..."

## Testing

To test the integration:

1. Start all services (Node.js backend, Python chatbot, frontend)
2. Navigate to a template page
3. Fill in some fields
4. Open the chatbot
5. Ask questions about the template - the chatbot should reference your specific idea and current answers

## Notes

- All new fields are **optional** - the chatbot works with or without template context
- Template context is automatically updated when user changes answers
- Context is stored in sessionStorage and persists across page refreshes
- The chatbot prioritizes template-specific context over generic LCI knowledge
