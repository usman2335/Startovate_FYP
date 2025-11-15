# Auto-Fill Endpoint Documentation

## Overview

The Auto-Fill endpoint uses AI to automatically populate template fields based on context, hints, and existing answers. This endpoint leverages the Mistral LLM to generate intelligent, contextually relevant responses.

## Endpoint Details

**URL:** `POST /chatbot/auto-fill`

**Base URL:** `http://localhost:8000` (development)

## Request Format

### Headers
```
Content-Type: application/json
```

### Request Body Schema

```json
{
  "systemPrompt": "string (required)",
  "templateKey": "string (required)",
  "stepDescription": "string (required)",
  "fieldHints": {
    "fieldName1": "description/hint for this field",
    "fieldName2": "description/hint for this field"
  },
  "repeatedFields": [
    {
      "pattern": "fieldPattern{N}",
      "description": "Description of the pattern"
    }
  ],
  "currentAnswers": {
    "fieldName1": "existing value or empty string",
    "fieldName2": "existing value or empty string"
  }
}
```

### Field Descriptions

- **systemPrompt** (required): The high-level context for the LLM. Should describe the business/project context.
- **templateKey** (required): Unique identifier for the template being filled.
- **stepDescription** (required): Description of the current step/section of the template.
- **fieldHints** (required): Dictionary mapping field names to their descriptions/hints.
- **repeatedFields** (optional): Array of repeated field patterns (e.g., for dynamic sections).
- **currentAnswers** (required): Dictionary of current field values (can be empty strings).

## Response Format

### Success Response

```json
{
  "success": true,
  "answers": {
    "fieldName1": "generated value 1",
    "fieldName2": "generated value 2",
    ...
  },
  "error": null
}
```

### Error Response

```json
{
  "success": false,
  "answers": null,
  "error": "Error description"
}
```

## Example Usage

### Example 1: Basic Problem Identification

```javascript
// Node.js/Express example
const axios = require('axios');

async function autoFillProblemIdentification() {
  try {
    const response = await axios.post('http://localhost:8000/chatbot/auto-fill', {
      systemPrompt: "A mobile app connecting local farmers with consumers",
      templateKey: "problem_identification",
      stepDescription: "Identify the top 3 problems your target customers face",
      fieldHints: {
        problem1: "The first and most critical problem",
        problem2: "The second most important problem",
        problem3: "The third problem in order of priority"
      },
      repeatedFields: [],
      currentAnswers: {
        problem1: "",
        problem2: "",
        problem3: ""
      }
    });

    if (response.data.success) {
      console.log('Generated answers:', response.data.answers);
      // Use the answers to populate your frontend form
    } else {
      console.error('Error:', response.data.error);
    }
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}
```

### Example 2: With Existing Context

```javascript
async function autoFillValueProposition() {
  try {
    const response = await axios.post('http://localhost:8000/chatbot/auto-fill', {
      systemPrompt: "Eco-friendly packaging solution for e-commerce",
      templateKey: "value_proposition",
      stepDescription: "Define your unique value proposition",
      fieldHints: {
        valueProposition: "A clear statement of unique value",
        keyBenefits: "Main benefits your solution offers",
        differentiation: "What makes you different from competitors"
      },
      repeatedFields: [],
      currentAnswers: {
        valueProposition: "Biodegradable packaging for e-commerce businesses",
        keyBenefits: "",  // This will be auto-filled
        differentiation: ""  // This will be auto-filled
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}
```

### Example 3: Python Client

```python
import requests

def auto_fill_template(system_prompt, template_key, step_description, 
                       field_hints, current_answers):
    """
    Call the auto-fill endpoint from Python
    """
    url = "http://localhost:8000/chatbot/auto-fill"
    
    payload = {
        "systemPrompt": system_prompt,
        "templateKey": template_key,
        "stepDescription": step_description,
        "fieldHints": field_hints,
        "repeatedFields": [],
        "currentAnswers": current_answers
    }
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error calling auto-fill: {e}")
        return {"success": False, "error": str(e)}

# Usage
result = auto_fill_template(
    system_prompt="A SaaS project management tool",
    template_key="customer_segments",
    step_description="Identify your target customer segments",
    field_hints={
        "segment1": "First customer segment",
        "segment2": "Second customer segment"
    },
    current_answers={
        "segment1": "",
        "segment2": ""
    }
)

if result["success"]:
    print("Generated answers:", result["answers"])
```

## Integration with Node Backend

### Adding to Your Backend Routes

```javascript
// backend/src/routes/chatbotRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const FASTAPI_BASE_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

router.post('/auto-fill', async (req, res) => {
  try {
    const {
      systemPrompt,
      templateKey,
      stepDescription,
      fieldHints,
      repeatedFields,
      currentAnswers
    } = req.body;

    // Validate required fields
    if (!systemPrompt || !templateKey || !stepDescription || !fieldHints) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Call FastAPI endpoint
    const response = await axios.post(`${FASTAPI_BASE_URL}/chatbot/auto-fill`, {
      systemPrompt,
      templateKey,
      stepDescription,
      fieldHints,
      repeatedFields: repeatedFields || [],
      currentAnswers: currentAnswers || {}
    }, {
      timeout: 30000 // 30 second timeout
    });

    res.json(response.data);

  } catch (error) {
    console.error('Auto-fill error:', error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || error.message
    });
  }
});

module.exports = router;
```

### Frontend API Call (React/Axios)

```javascript
// frontend/src/utils/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const autoFillTemplate = async (
  systemPrompt,
  templateKey,
  stepDescription,
  fieldHints,
  currentAnswers
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/chatbot/auto-fill`, {
      systemPrompt,
      templateKey,
      stepDescription,
      fieldHints,
      repeatedFields: [],
      currentAnswers
    });

    return response.data;
  } catch (error) {
    console.error('Auto-fill request failed:', error);
    throw error;
  }
};

// Usage in a React component
import { autoFillTemplate } from '../utils/api';

const MyComponent = () => {
  const handleAutoFill = async () => {
    try {
      const result = await autoFillTemplate(
        "My business context",
        "template_1",
        "Describe the step",
        {
          field1: "Description of field 1",
          field2: "Description of field 2"
        },
        {
          field1: "",
          field2: ""
        }
      );

      if (result.success) {
        // Update your form with result.answers
        console.log('Generated answers:', result.answers);
      } else {
        console.error('Error:', result.error);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (
    <button onClick={handleAutoFill}>
      Auto-Fill Template
    </button>
  );
};
```

## Error Handling

The endpoint includes comprehensive error handling for:

1. **Validation Errors**: Missing or empty required fields
2. **LLM API Errors**: Issues communicating with Mistral API
3. **JSON Parsing Errors**: Invalid or malformed LLM responses
4. **Unexpected Errors**: Catches all other exceptions

All errors return a consistent format:

```json
{
  "success": false,
  "answers": null,
  "error": "Description of the error"
}
```

## CORS Configuration

The endpoint is already configured with CORS middleware to accept requests from:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://localhost:51722`

If you need to add more origins, modify the `allow_origins` list in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:51722",
        "http://your-custom-origin.com"  # Add your origin here
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Testing

### Running the Test Script

```bash
# Make sure FastAPI server is running
cd LCI_ChatBot
uvicorn main:app --reload

# In another terminal, run the test script
python test_autofill.py
```

### Manual Testing with cURL

```bash
curl -X POST http://localhost:8000/chatbot/auto-fill \
  -H "Content-Type: application/json" \
  -d '{
    "systemPrompt": "A mobile fitness app for busy professionals",
    "templateKey": "problem_identification",
    "stepDescription": "Identify customer problems",
    "fieldHints": {
      "problem1": "Main problem customers face"
    },
    "repeatedFields": [],
    "currentAnswers": {
      "problem1": ""
    }
  }'
```

## Performance Considerations

- **Timeout**: The endpoint has a 30-second timeout for LLM responses
- **Rate Limiting**: Consider implementing rate limiting if exposed to public
- **Caching**: For repeated similar requests, consider caching results
- **Async Processing**: For batch operations, consider implementing async task queue

## Security Best Practices

1. **API Key Protection**: Ensure `MISTRAL_API_KEY` is stored securely in `.env`
2. **Input Validation**: All inputs are validated using Pydantic models
3. **CORS**: Restrict `allow_origins` to only trusted domains in production
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Authentication**: Consider adding authentication for production use

## Troubleshooting

### Common Issues

1. **"Mistral API key not configured"**
   - Ensure `MISTRAL_API_KEY` is set in your `.env` file

2. **"Failed to parse LLM response as JSON"**
   - The LLM occasionally returns non-JSON responses. The endpoint attempts to clean common formatting issues.
   - Check the console logs for the raw LLM response

3. **CORS errors**
   - Add your frontend origin to the `allow_origins` list in `main.py`

4. **Timeout errors**
   - Increase the timeout in the request configuration
   - Check if Mistral API is experiencing issues

## Next Steps

- Consider adding user authentication
- Implement request logging for monitoring
- Add metrics and analytics
- Create a feedback mechanism to improve prompts
- Implement caching for common templates

