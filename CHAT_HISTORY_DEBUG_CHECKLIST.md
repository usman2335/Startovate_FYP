# Chat History Debug Checklist

## What Should Happen

### When You Send a Message:

**Backend Console:**
```
💾 Saving chat history for userId: 507f1f77bcf86cd799439011 canvasId: null
📝 Creating new chat history document (or Updating existing...)
✅ Chat history saved to database (total messages: 2)
```

**Browser Console:**
```
Sending enriched context-aware chat request: {...}
```

### When You Close and Reopen Chat:

**Browser Console:**
```
🔍 Loading chat history for canvasId: undefined
📡 Calling getChatHistory API with params: {}
📡 getChatHistory API response: { success: true, data: {...} }
📥 Received history: { hasHistory: true, messages: [...] }
✅ Loaded 2 messages from history
```

**Backend Console:**
```
📥 getChatHistory request: { userId: 507f1f77bcf86cd799439011, canvasId: 'null' }
🔍 Querying chat history with: { userId: ..., canvasId: null }
📊 Found chat history: Yes (2 messages)
✅ Returning chat history with 2 messages
```

## Test Steps

### Test 1: Basic Save and Load

1. **Login** to your account
2. **Open chatbot** (click floating button)
3. **Send a message**: "test message 1"
4. **Check backend console** - should see "Chat history saved"
5. **Close chatbot** (click X)
6. **Reopen chatbot** (click floating button)
7. **Check browser console** - should see "Loaded X messages from history"
8. **Verify** - You should see "test message 1" in the chat

### Test 2: Multiple Messages

1. **Send message**: "test message 2"
2. **Send message**: "test message 3"
3. **Close and reopen** chatbot
4. **Verify** - You should see all 3 messages

### Test 3: Page Refresh

1. **Refresh the page** (F5)
2. **Open chatbot**
3. **Verify** - You should see all previous messages

### Test 4: Logout and Login

1. **Logout** from your account
2. **Login** again
3. **Open chatbot**
4. **Verify** - You should see all previous messages

### Test 5: Different User

1. **Logout**
2. **Login with a different account**
3. **Open chatbot**
4. **Verify** - Should NOT see the previous user's messages
5. **Send a message**: "different user message"
6. **Close and reopen**
7. **Verify** - Should see only "different user message"

### Test 6: Canvas-Specific History

1. **Navigate to a canvas** (with canvasId)
2. **Open chatbot**
3. **Send message**: "canvas specific message"
4. **Close and reopen**
5. **Verify** - Should see "canvas specific message"
6. **Navigate to a different page** (no canvasId)
7. **Open chatbot**
8. **Verify** - Should see general messages, NOT canvas-specific ones

## Common Issues and Fixes

### Issue: "No history found" in backend logs

**Possible Causes:**
1. User not authenticated (req.user is undefined)
2. Query mismatch (canvasId doesn't match)
3. No messages saved yet

**Fix:**
- Check if you're logged in
- Check backend logs for "Chat history saved" message
- Check MongoDB directly: `db.chathistories.find()`

### Issue: History loads but shows empty array

**Possible Causes:**
1. Messages array is empty in database
2. Frontend not parsing messages correctly

**Fix:**
- Check MongoDB: `db.chathistories.findOne({ userId: ObjectId("...") })`
- Check if messages array has items
- Check browser console for parsing errors

### Issue: History loads for wrong user

**Possible Causes:**
1. Authentication issue (wrong userId)
2. Not filtering by userId correctly

**Fix:**
- Check backend logs for userId in save and load
- Verify they match
- Check JWT token is valid

### Issue: Canvas-specific history not working

**Possible Causes:**
1. canvasId not being passed correctly
2. Query not matching canvasId

**Fix:**
- Check browser console: "Loading chat history for canvasId: ..."
- Should show actual canvasId, not undefined
- Check backend query includes canvasId

## MongoDB Queries for Debugging

```javascript
// Connect to MongoDB
mongosh
use startovate

// See all chat histories
db.chathistories.find().pretty()

// Find by userId
db.chathistories.find({ userId: ObjectId("YOUR_USER_ID") }).pretty()

// Find by canvasId
db.chathistories.find({ canvasId: ObjectId("YOUR_CANVAS_ID") }).pretty()

// Find general chat (no canvas)
db.chathistories.find({ canvasId: null }).pretty()

// Count messages
db.chathistories.aggregate([
  { $project: { userId: 1, messageCount: { $size: "$messages" } } }
])

// Delete all chat histories (reset)
db.chathistories.deleteMany({})

// Delete for specific user
db.chathistories.deleteMany({ userId: ObjectId("YOUR_USER_ID") })
```

## Expected Database Document

```json
{
  "_id": ObjectId("..."),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "canvasId": null,
  "templateKey": null,
  "messages": [
    {
      "role": "user",
      "content": "test message 1",
      "timestamp": ISODate("2024-01-15T10:00:00.000Z"),
      "_id": ObjectId("...")
    },
    {
      "role": "assistant",
      "content": "I'd be happy to help...",
      "timestamp": ISODate("2024-01-15T10:00:05.000Z"),
      "_id": ObjectId("...")
    }
  ],
  "lastMessageAt": ISODate("2024-01-15T10:00:05.000Z"),
  "createdAt": ISODate("2024-01-15T09:00:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:00:05.000Z"),
  "__v": 0
}
```

## Success Criteria

✅ Messages save to database with correct userId
✅ Messages load when reopening chat
✅ Messages persist after page refresh
✅ Messages persist after logout/login
✅ Different users see different messages
✅ Canvas-specific messages are separate from general messages
✅ Clear history button works
