"""
Test script for the Auto Fill endpoint.

This script demonstrates how to call the /chatbot/auto-fill endpoint
with various example payloads.

Usage:
    python test_autofill.py

Make sure the FastAPI server is running on http://localhost:8000
"""

import requests
import json

# Base URL for the FastAPI server
BASE_URL = "http://localhost:8000"

def test_autofill_basic():
    """Test basic auto-fill functionality"""
    print("=" * 70)
    print("TEST 1: Basic Auto-Fill for Problem Identification Template")
    print("=" * 70)
    
    payload = {
        "systemPrompt": "You are helping an entrepreneur develop a Lean Canvas for a mobile app that connects local farmers with consumers.",
        "templateKey": "problem_identification_1",
        "stepDescription": "Identify the top 3 problems that your target customers face",
        "fieldHints": {
            "problem1": "The first and most critical problem your customers face",
            "problem2": "The second most important problem",
            "problem3": "The third problem in order of priority",
            "existingSolutions": "Current alternatives or workarounds customers use"
        },
        "repeatedFields": [],
        "currentAnswers": {
            "problem1": "",
            "problem2": "",
            "problem3": "",
            "existingSolutions": ""
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/chatbot/auto-fill",
            json=payload,
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print("\nResponse:")
        print(json.dumps(response.json(), indent=2))
        
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

def test_autofill_with_context():
    """Test auto-fill with existing context"""
    print("\n" + "=" * 70)
    print("TEST 2: Auto-Fill with Existing Context")
    print("=" * 70)
    
    payload = {
        "systemPrompt": "You are helping a startup create a value proposition for their eco-friendly packaging solution.",
        "templateKey": "value_proposition",
        "stepDescription": "Define your unique value proposition and key benefits",
        "fieldHints": {
            "valueProposition": "A clear statement of the unique value you provide",
            "keyBenefits": "List of main benefits your solution offers",
            "differentiation": "What makes your solution different from competitors"
        },
        "repeatedFields": [],
        "currentAnswers": {
            "valueProposition": "Biodegradable packaging for e-commerce businesses",
            "keyBenefits": "",
            "differentiation": ""
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/chatbot/auto-fill",
            json=payload,
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print("\nResponse:")
        print(json.dumps(response.json(), indent=2))
        
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

def test_autofill_with_repeated_fields():
    """Test auto-fill with repeated fields"""
    print("\n" + "=" * 70)
    print("TEST 3: Auto-Fill with Repeated Fields")
    print("=" * 70)
    
    payload = {
        "systemPrompt": "You are helping a SaaS company define their customer segments for a project management tool.",
        "templateKey": "customer_segments",
        "stepDescription": "Identify and describe your target customer segments",
        "fieldHints": {
            "segment1_name": "Name of the first customer segment",
            "segment1_description": "Detailed description of this segment",
            "segment1_size": "Estimated market size",
            "segment2_name": "Name of the second customer segment",
            "segment2_description": "Detailed description of this segment",
            "segment2_size": "Estimated market size"
        },
        "repeatedFields": [
            {
                "pattern": "segment{N}_name",
                "description": "Customer segment name pattern"
            },
            {
                "pattern": "segment{N}_description",
                "description": "Customer segment description pattern"
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
    
    try:
        response = requests.post(
            f"{BASE_URL}/chatbot/auto-fill",
            json=payload,
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print("\nResponse:")
        print(json.dumps(response.json(), indent=2))
        
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

def test_autofill_error_handling():
    """Test error handling with invalid payload"""
    print("\n" + "=" * 70)
    print("TEST 4: Error Handling - Missing Required Fields")
    print("=" * 70)
    
    payload = {
        "systemPrompt": "",  # Empty system prompt
        "templateKey": "test_template",
        "stepDescription": "",  # Empty step description
        "fieldHints": {},  # Empty field hints
        "repeatedFields": [],
        "currentAnswers": {}
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/chatbot/auto-fill",
            json=payload,
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print("\nResponse:")
        print(json.dumps(response.json(), indent=2))
        
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("\n🧪 Testing Auto-Fill Endpoint")
    print("Make sure the FastAPI server is running on http://localhost:8000\n")
    
    # Run all tests
    test_autofill_basic()
    test_autofill_with_context()
    test_autofill_with_repeated_fields()
    test_autofill_error_handling()
    
    print("\n" + "=" * 70)
    print("✅ All tests completed!")
    print("=" * 70)

