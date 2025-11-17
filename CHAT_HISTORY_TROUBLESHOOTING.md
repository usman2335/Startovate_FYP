# Chat History Troubleshooting Guide

## Issue: History Not Loading

If chat history is not loading, follow these steps:

### Step 1: Check Browser Console

Open browser DevTools (F12) and look for these logs when opening the chat:

```
🔍 Loading chat history for canvasId: <id or undefined>
📥 Received history: { hasHistory: true/false, messages: [...] }
✅ Loaded X messages from history
```

**If you see errors:**
- Check if the API call is failing (Network tab)
- Check if authentication is working (should have JWT token)

### Step 2: Check Backend Logs

When you send a message, you should see:

```
💾 Saving chat history for userId: <id> canvasId: <id or null>
📝 Creating new chat history document (or Updating existing...)
✅ Chat history saved to database (total messages: X)
```

When you load chat, you should see:

```
📥 getChatHistory request: { userId: <id>, canvasId: <id or undefined> }
🔍 Querying chat history with: { userId: <id>, canvasId: <id or null> }
📊 Found chat history: Yes (X messages) or No
✅ Returning chat history with X messages
```

**If you don't see these logs:**
- Backend might not be running
- Routes might not be registered
- Authentication middleware might be failing

### Step 3: Test the Model

Run the test script to verify the ChatHistory model works:

```bash
cd backend
node test-chat-history.js
```

You should see:
```
✅ Connected to MongoDB
✅ Test chat history created: <id>
✅ Test chat history retrieved: Yes
   Messages count: 2
✅ Test chat history deleted
✅ All tests passed!
```

**If this fails:**
- Check MongoDB is running
- Check MONGO_URI in .env file
- Check ChatHistory model file exists

### Step 4: Check Database Directly

Connect to MongoDB and check if data is being saved:

```bash
# Using MongoDB shell
mongosh

use startovate
db.chathistories.find().pretty()
```

You should see documents like:
```json
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."),
  "canvasId": ObjectId("...") or null,
  "messages": [
    {
      "role": "user",
      "content": "...",
      "timestamp": ISODate("...")
    }
  ],
  "lastMessageAt": ISODate("..."),
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

**If no documents exist:**
- Messages aren't being saved
- Check backend logs for save errors
- Check authentication is working

### Step 5: Common Issues

#### Issue: "Cannot read property '_id' of undefined"
**Cause:** User not authenticated
**Fix:** Make sure you're logged in and JWT token is valid

#### Issue: History loads but shows empty
**Cause:** Query mismatch (canvasId doesn't match)
**Fix:** 
- Check if canvasId is being passed correctly
- Try without canvasId filter (will load all user's messages)

#### Issue: Messages save but don't load
**Cause:** Query not finding the saved document
**Fix:**
- Check if userId matches between save and load
- Check if canvasId is null vs undefined issue
- Look at database directly to see what's saved

#### Issue: "ChatHistory is not defined"
**Cause:** Model not imported in controller
**Fix:** Check `backend/src/controllers/chatbotController.js` has:
```javascript
const ChatHistory = require("../models/ChatHistory");
```

### Step 6: Manual Test

1. **Send a test message:**
   - Open chat
   - Send "test message"
   - Check backend logs for save confirmation

2. **Close and reopen chat:**
   - Close the chat window
   - Reopen it
   - Should see "test message" in history

3. **Refresh page:**
   - Refresh the browser
   - Open chat
   - Should still see "test message"

4. **Logout and login:**
   - Logout
   - Login again
   - Open chat
   - Should still see "test message"

### Step 7: Debug API Call

Add this to browser console to test the API directly:

```javascript
// Test get history
fetch('http://localhost:5000/api/chatbot/history', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => console.log('History:', data));
```

Should return:
```json
{
  "success": true,
  "data": {
    "messages": [...],
    "hasHistory": true,
    "lastMessageAt": "..."
  }
}
```

### Quick Fixes

**Reset everything and start fresh:**

```bash
# 1. Clear database
mongosh
use startovate
db.chathistories.deleteMany({})

# 2. Restart backend
cd backend
npm start

# 3. Restart frontend
cd frontend
npm run dev

# 4. Clear browser cache and cookies
# 5. Login again
# 6. Send a test message
# 7. Close and reopen chat
```

### Still Not Working?

Check these files exist and have correct content:
- ✅ `backend/src/models/ChatHistory.js`
- ✅ `backend/src/controllers/chatbotController.js` (has getChatHistory and save logic)
- ✅ `backend/src/routes/chatbotRoutes.js` (has history routes)
- ✅ `frontend/src/utils/api.js` (has getChatHistory function)
- ✅ `frontend/src/components/FloatingChat.jsx` (has useEffect to load history)

If all else fails, check the console logs carefully - they will tell you exactly where the issue is!
