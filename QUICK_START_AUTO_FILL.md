# 🚀 Quick Start Guide - Auto Fill Feature

## Prerequisites

- ✅ Mistral API key (set in `LCI_ChatBot/.env`)
- ✅ Python 3.8+ with FastAPI installed
- ✅ Node.js with Express backend running
- ✅ React frontend setup

## 1️⃣ Start FastAPI Backend (Terminal 1)

```bash
cd LCI_ChatBot
uvicorn main:app --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Verify it's running:**
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "ok",
  "provider": "mistral",
  "model": "mistral-small-latest",
  "chat_memory_size": 0
}
```

## 2️⃣ Start Node.js Backend (Terminal 2)

```bash
cd backend
npm start
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected successfully
```

## 3️⃣ Test with Python Script (Terminal 3)

```bash
cd LCI_ChatBot
python test_autofill.py
```

**Expected Output:**
- Test 1: Basic auto-fill for problem identification
- Test 2: Auto-fill with existing context
- Test 3: Auto-fill with repeated fields
- Test 4: Error handling test

## 4️⃣ Test with cURL

### Simple Test:

```bash
curl -X POST http://localhost:8000/chatbot/auto-fill \
  -H "Content-Type: application/json" \
  -d '{
    "systemPrompt": "A mobile app for fitness tracking",
    "templateKey": "problem_identification",
    "stepDescription": "Identify key customer problems",
    "fieldHints": {
      "problem1": "Main problem users face"
    },
    "repeatedFields": [],
    "currentAnswers": {
      "problem1": ""
    }
  }'
```

### Expected Response:

```json
{
  "success": true,
  "answers": {
    "problem1": "Busy professionals struggle to maintain consistent workout routines due to time constraints and lack of personalized guidance"
  },
  "error": null
}
```

## 5️⃣ Test from React Frontend

### Method 1: Using the Example Component

1. Copy the example component:
```bash
# If not already created
cp frontend/src/examples/AutoFillExample.jsx frontend/src/components/
```

2. Import and use in your app:
```javascript
import AutoFillExample from './components/AutoFillExample';

function App() {
  return (
    <div>
      <AutoFillExample />
    </div>
  );
}
```

### Method 2: Quick Test in Browser Console

1. Start your React app:
```bash
cd frontend
npm start
```

2. Open browser console (F12)

3. Run this code:
```javascript
// Import axios if not already available
const axios = window.axios || require('axios');

// Test the auto-fill endpoint
axios.post('http://localhost:5000/api/chatbot/autofill', {
  templateKey: 'problem_identification',
  stepDescription: 'Identify customer problems',
  fieldHints: {
    problem1: 'Main customer problem'
  },
  currentAnswers: {
    problem1: ''
  }
}, {
  withCredentials: true
})
.then(response => {
  console.log('Success!', response.data);
})
.catch(error => {
  console.error('Error:', error.response?.data || error.message);
});
```

## 6️⃣ Integrate Into Your Template

### Step-by-Step Integration:

1. **Add the import:**
```javascript
import { autofillTemplateFields } from '../utils/api';
```

2. **Add state variables:**
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

3. **Create the handler function:**
```javascript
const handleAutoFill = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const generatedAnswers = await autofillTemplateFields({
      templateKey: 'your_template_key',
      stepDescription: 'Description of this step',
      fieldHints: {
        field1: 'Description of field1',
        field2: 'Description of field2',
      },
      currentAnswers: answers,  // Your current state
    });
    
    // Update your form state
    setAnswers(generatedAnswers);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

4. **Add the button to your JSX:**
```javascript
<button 
  onClick={handleAutoFill} 
  disabled={loading}
  className="autofill-button"
>
  {loading ? 'Generating...' : '✨ Auto-Fill with AI'}
</button>

{error && (
  <div className="error-message">
    {error}
  </div>
)}
```

## 🧪 Testing Checklist

### Basic Functionality
- [ ] FastAPI health endpoint responds
- [ ] Node.js backend can reach FastAPI
- [ ] Auto-fill endpoint returns valid JSON
- [ ] Frontend can call backend endpoint

### Error Handling
- [ ] Empty field hints returns error
- [ ] Missing required fields returns error
- [ ] Invalid JSON is handled gracefully
- [ ] Timeout works (wait >60 seconds)
- [ ] CORS allows frontend requests

### Integration
- [ ] Generated answers populate form fields
- [ ] Loading state shows during generation
- [ ] Error messages display properly
- [ ] Can regenerate multiple times
- [ ] Can edit generated answers

## 🐛 Common Issues & Solutions

### Issue: "MISTRAL_API_KEY is not set"
**Solution:**
```bash
# Create or edit .env file in LCI_ChatBot directory
echo "MISTRAL_API_KEY=your_actual_api_key" > LCI_ChatBot/.env
```

### Issue: "Connection refused on port 8000"
**Solution:**
```bash
# Make sure FastAPI is running
cd LCI_ChatBot
uvicorn main:app --reload
```

### Issue: "Authentication required" (Node.js)
**Solution:**
```javascript
// The Node.js endpoint requires authentication
// Make sure you're logged in or remove the protect middleware for testing:

// In backend/src/routes/chatbotRoutes.js
router.post("/autofill", autofillFields);  // Remove 'protect' for testing
```

### Issue: CORS error in browser
**Solution:**
```python
# In LCI_ChatBot/main.py, add your frontend URL:
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:YOUR_PORT",  # Add your port
    ],
    ...
)
```

### Issue: "Failed to parse LLM response"
**Cause:** Sometimes Mistral returns text with markdown formatting
**Solution:** The endpoint automatically strips markdown. If it persists:
1. Check the console logs for the raw response
2. Try regenerating
3. Verify your Mistral API key is valid

## 📊 Example Payloads

### Problem Identification Template
```json
{
  "templateKey": "problem_identification",
  "stepDescription": "Identify the top 3 problems your customers face",
  "systemPrompt": "A meal planning app for busy parents",
  "fieldHints": {
    "problem1": "The most critical problem",
    "problem2": "The second problem",
    "problem3": "The third problem",
    "existingSolutions": "Current alternatives"
  },
  "currentAnswers": {
    "problem1": "",
    "problem2": "",
    "problem3": "",
    "existingSolutions": ""
  }
}
```

### Value Proposition Template
```json
{
  "templateKey": "value_proposition",
  "stepDescription": "Define your unique value proposition",
  "systemPrompt": "An eco-friendly packaging solution for e-commerce",
  "fieldHints": {
    "headline": "Your main value proposition in one sentence",
    "subheadline": "Expand on the value you provide",
    "keyBenefits": "Top 3 benefits of your solution"
  },
  "currentAnswers": {
    "headline": "",
    "subheadline": "",
    "keyBenefits": ""
  }
}
```

### Customer Segments Template
```json
{
  "templateKey": "customer_segments",
  "stepDescription": "Identify your target customer segments",
  "systemPrompt": "A B2B SaaS project management tool",
  "fieldHints": {
    "segment1_name": "Name of first segment",
    "segment1_description": "Detailed description",
    "segment1_size": "Market size estimate",
    "segment2_name": "Name of second segment",
    "segment2_description": "Detailed description",
    "segment2_size": "Market size estimate"
  },
  "repeatedFields": [
    {
      "pattern": "segment{N}_name",
      "description": "Segment name pattern"
    }
  ],
  "currentAnswers": {
    "segment1_name": "Small Business Owners",
    "segment1_description": "",
    "segment1_size": "",
    "segment2_name": "",
    "segment2_description": "",
    "segment2_size": ""
  }
}
```

## 🎯 Success Indicators

You'll know it's working when:

1. ✅ FastAPI returns `status: "ok"` on `/health`
2. ✅ Python test script completes all 4 tests
3. ✅ cURL request returns `success: true` with answers
4. ✅ Frontend button triggers generation
5. ✅ Loading state shows "Generating..."
6. ✅ Form fields populate with AI-generated content
7. ✅ No errors in browser console
8. ✅ No errors in backend logs

## 🎓 Learn More

- **Full Documentation:** See `LCI_ChatBot/AUTO_FILL_ENDPOINT.md`
- **Implementation Details:** See `AUTO_FILL_IMPLEMENTATION_SUMMARY.md`
- **Example Component:** See `frontend/src/examples/AutoFillExample.jsx`
- **Test Script:** See `LCI_ChatBot/test_autofill.py`

## 📞 Need Help?

1. Check all three server logs (FastAPI, Node.js, React)
2. Verify environment variables are set
3. Review the error messages
4. Check the documentation files
5. Run the test script to isolate issues

## 🎉 You're Ready!

If you've completed the testing checklist, you're ready to integrate auto-fill into your templates. Start with the example component and customize it for your needs!

---

**Quick Command Reference:**

```bash
# Terminal 1: FastAPI
cd LCI_ChatBot && uvicorn main:app --reload

# Terminal 2: Node.js
cd backend && npm start

# Terminal 3: React
cd frontend && npm start

# Terminal 4: Test
cd LCI_ChatBot && python test_autofill.py
```

