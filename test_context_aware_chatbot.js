// Test script for context-aware chatbot functionality
// Run this in the browser console to test the context system

const testContextAwareChatbot = async () => {
  console.log("🧪 Testing Context-Aware Chatbot Integration...");

  try {
    // Test 1: Check if context provider is working
    console.log("1. Testing context provider...");
    if (window.React && window.React.useContext) {
      console.log("✅ React context system available");
    }

    // Test 2: Test API endpoints
    console.log("2. Testing backend endpoints...");

    // Test health endpoint
    const healthResponse = await fetch(
      "http://localhost:5000/api/chatbot/health",
      {
        credentials: "include",
      }
    );
    if (healthResponse.ok) {
      console.log("✅ Backend health endpoint working");
    }

    // Test 3: Test context-aware chat request
    console.log("3. Testing context-aware chat request...");

    const testPayload = {
      query: "What is problem identification in LCI?",
      top_k: 3,
      canvasId: "test-canvas-123",
      templateId: "ProblemIdentification-Step1",
    };

    const chatResponse = await fetch(
      "http://localhost:5000/api/chatbot/send-message",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(testPayload),
      }
    );

    if (chatResponse.ok) {
      const chatData = await chatResponse.json();
      console.log("✅ Context-aware chat request successful");
      console.log("Response:", chatData);
    } else {
      console.log("❌ Context-aware chat request failed:", chatResponse.status);
    }

    // Test 4: Test FastAPI backend directly
    console.log("4. Testing FastAPI backend directly...");

    const fastApiResponse = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "What is LCI methodology?",
        canvasId: "test-canvas-456",
        templateId: "LiteratureSearch-Step2",
        top_k: 3,
      }),
    });

    if (fastApiResponse.ok) {
      const fastApiData = await fastApiResponse.json();
      console.log("✅ FastAPI context-aware endpoint working");
      console.log("Response:", fastApiData);
    } else {
      console.log(
        "❌ FastAPI context-aware endpoint failed:",
        fastApiResponse.status
      );
    }

    console.log("🎉 All context-aware tests completed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
    console.log("💡 Make sure both backends are running:");
    console.log("   - Node.js backend: http://localhost:5000");
    console.log("   - FastAPI backend: http://localhost:8000");
  }
};

// Test context detection
const testContextDetection = () => {
  console.log("🔍 Testing Context Detection...");

  // Simulate setting context in sessionStorage
  sessionStorage.setItem("currentCanvasId", "test-canvas-789");
  sessionStorage.setItem("currentTemplateId", "ProblemIdentification-Step1");
  sessionStorage.setItem("currentComponentName", "Problem Identification");

  console.log("✅ Context set in sessionStorage:");
  console.log("   Canvas ID:", sessionStorage.getItem("currentCanvasId"));
  console.log("   Template ID:", sessionStorage.getItem("currentTemplateId"));
  console.log("   Component:", sessionStorage.getItem("currentComponentName"));

  // Clear test data
  setTimeout(() => {
    sessionStorage.removeItem("currentCanvasId");
    sessionStorage.removeItem("currentTemplateId");
    sessionStorage.removeItem("currentComponentName");
    console.log("🧹 Test context cleared");
  }, 5000);
};

// Run tests
console.log("🚀 Starting Context-Aware Chatbot Tests...");
testContextDetection();
testContextAwareChatbot();
