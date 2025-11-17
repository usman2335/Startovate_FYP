# Chat History Persistence Feature

## Overview
Chat history is now saved to MongoDB and persists across sessions. Users can see their previous conversations when they log back in.

## What Was Implemented

### 1. Database Model (`backend/src/models/ChatHistory.js`)
- **ChatHistory Schema** with:
  - `userId`: Reference to the user
  - `canvasId`: Optional reference to canvas (for context-specific history)
  - `templateKey`: Optional template identifier
  - `messages`: Array of message objects (role, content, timestamp)
  - `lastMessageAt`: Timestamp of last message
  - Indexes for efficient queries

### 2. Backend API (`backend/src/controllers/chatbotController.js`)
- **Enhanced `sendChatMessage`**:
  - Saves both user query and bot response to database
  - Associates messages with user and canvas
  - Updates last message timestamp

- **New `getChatHistory` endpoint**:
  - Retrieves chat history for current user
  - Optional filtering by canvasId
  - Returns messages sorted by timestamp

- **New `clearChatHistory` endpoint**:
  - Deletes chat history for current user
  - Optional filtering by canvasId

### 3. Routes (`backend/src/routes/chatbotRoutes.js`)
- `GET /api/chatbot/history` - Get chat history
- `DELETE /api/chatbot/history` - Clear chat history

### 4. Frontend API (`frontend/src/utils/api.js`)
- `getChatHistory(canvasId)` - Fetch chat history
- `clearChatHistory(canvasId)` - Clear chat history

### 5. UI Component (`frontend/src/components/FloatingChat.jsx`)
- **Auto-loads chat history** on component mount
- **Shows loading indicator** while fetching history
- **Clear history button** (trash icon) in header
- **Confirmation dialog** before clearing
- **Canvas-specific history** - loads history for current canvas

## Features

✅ **Persistent Storage**: All chat messages saved to MongoDB
✅ **User-Specific**: Each user has their own chat history
✅ **Canvas-Aware**: History can be filtered by canvas
✅ **Auto-Load**: Previous conversations load automatically
✅ **Clear History**: Users can delete their chat history
✅ **Timestamps**: All messages have timestamps
✅ **Error Handling**: Graceful fallback if history fails to load

## How It Works

### When User Opens Chat:
1. Component loads and checks connection status
2. Fetches chat history from database for current user/canvas
3. Displays previous messages in chronological order
4. Shows welcome message if no history exists

### When User Sends Message:
1. Message sent to chatbot API
2. Both user query and bot response saved to database
3. Messages associated with userId and canvasId
4. lastMessageAt timestamp updated

### When User Clears History:
1. Confirmation dialog appears
2. If confirmed, DELETE request sent to backend
3. All messages for user/canvas deleted from database
4. UI shows fresh welcome message

## Database Structure

```javascript
{
  userId: ObjectId("..."),
  canvasId: ObjectId("...") or null,
  templateKey: "ProblemIdentification-Step3" or null,
  messages: [
    {
      role: "user",
      content: "Help me with this step",
      timestamp: ISODate("2024-01-01T10:00:00Z")
    },
    {
      role: "assistant",
      content: "I'd be happy to help...",
      timestamp: ISODate("2024-01-01T10:00:05Z")
    }
  ],
  lastMessageAt: ISODate("2024-01-01T10:00:05Z"),
  createdAt: ISODate("2024-01-01T09:00:00Z"),
  updatedAt: ISODate("2024-01-01T10:00:05Z")
}
```

## API Endpoints

### Get Chat History
```
GET /api/chatbot/history?canvasId=<optional>
Authorization: Required (JWT token)

Response:
{
  "success": true,
  "data": {
    "messages": [...],
    "hasHistory": true,
    "lastMessageAt": "2024-01-01T10:00:05Z"
  }
}
```

### Clear Chat History
```
DELETE /api/chatbot/history
Authorization: Required (JWT token)
Body: { "canvasId": "<optional>" }

Response:
{
  "success": true,
  "message": "Chat history cleared successfully"
}
```

## Testing

1. **Start all services**:
   ```bash
   # Terminal 1: MongoDB (if not running)
   mongod

   # Terminal 2: Node.js backend
   cd backend
   npm start

   # Terminal 3: Python chatbot
   cd LCI_ChatBot
   python main.py

   # Terminal 4: Frontend
   cd frontend
   npm run dev
   ```

2. **Test the feature**:
   - Login to your account
   - Open the chatbot (floating button)
   - Send a few messages
   - Close and reopen the chatbot - messages should persist
   - Navigate to a different page and back - messages still there
   - Click the trash icon to clear history
   - Logout and login again - history should be there (unless cleared)

## Benefits

✅ **Better UX**: Users don't lose conversation context
✅ **Continuity**: Can pick up where they left off
✅ **Reference**: Can review previous advice and suggestions
✅ **Context**: Bot has access to conversation history
✅ **Privacy**: Users can clear their history anytime

## Notes

- History is saved per user and optionally per canvas
- If canvas context changes, history for that canvas is loaded
- Clearing history requires confirmation to prevent accidents
- History save failures don't break the chat functionality
- All endpoints require authentication
