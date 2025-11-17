# Quick Guide: Chatbot Template Context

## What Was Done

Your chatbot now receives **the same context as auto-fill** when users are on template pages:

- ✅ Step description (what the current step is about)
- ✅ User's idea/business concept
- ✅ Field hints (what each field should contain)
- ✅ Current answers (what the user has already filled in)

## Files Modified

### Backend (Python)
- `LCI_ChatBot/main.py`
  - Added new fields to `ChatRequest` schema
  - Enhanced `/chat` endpoint to use template context

### Backend (Node.js)
- `backend/src/controllers/chatbotController.js`
  - Enhanced `sendChatMessage` to fetch and forward template context

### Frontend
- `frontend/src/utils/api.js`
  - Updated `sendChatMessage` to accept template context
  
- `frontend/src/context/chatbotContext.jsx`
  - Added template data storage and retrieval
  
- `frontend/src/components/FloatingChat.jsx`
  - Updated to send template context with messages
  
- `frontend/src/components/Templates/TemplateComponent.jsx`
  - Updated to set template context when user is on template page

## How to Test

1. **Start all services**:
   ```bash
   # Terminal 1: Node.js backend
   cd backend
   npm start

   # Terminal 2: Python chatbot
   cd LCI_ChatBot
   python main.py

   # Terminal 3: Frontend
   cd frontend
   npm run dev
   ```

2. **Test the feature**:
   - Login and create/open a canvas
   - Navigate to any template (e.g., Problem Identification - Step 3)
   - Fill in some fields with your idea
   - Open the chatbot (floating button)
   - Ask questions like:
     - "Help me with this step"
     - "What should I write in the problem field?"
     - "Review my current answers"
   
3. **Expected behavior**:
   - Chatbot should reference YOUR specific idea
   - Chatbot should know which step you're on
   - Chatbot should see your current answers
   - Responses should be personalized, not generic

## Example Conversation

**User fills in**: 
- Idea: "A mobile app for finding local farmers markets"
- Problem field: "People don't know where farmers markets are"

**User asks chatbot**: "Help me improve my problem description"

**Chatbot responds**: "Based on your idea about a mobile app for finding local farmers markets, your problem description 'People don't know where farmers markets are' is a good start. Consider expanding it to include: 1) The impact of this problem (e.g., missed opportunities for fresh produce), 2) Who specifically faces this problem (urban residents, health-conscious consumers), and 3) Current workarounds people use (Google searches, word of mouth)..."

## Backward Compatibility

✅ The chatbot still works normally when:
- User is NOT on a template page
- Template context is not available
- User is on the general chat page

All new fields are optional, so existing functionality is preserved.
