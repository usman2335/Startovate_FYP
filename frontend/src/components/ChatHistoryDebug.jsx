import React, { useState } from "react";
import { getChatHistory, clearChatHistory } from "../utils/api";

/**
 * Debug component to test chat history API directly
 * Add this to your page temporarily to test
 */
const ChatHistoryDebug = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testGetHistory = async () => {
    setLoading(true);
    console.log("🧪 Testing getChatHistory...");
    try {
      const history = await getChatHistory(null);
      console.log("🧪 Result:", history);
      setResult(JSON.stringify(history, null, 2));
    } catch (error) {
      console.error("🧪 Error:", error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testClearHistory = async () => {
    if (!window.confirm("Clear all history?")) return;
    
    setLoading(true);
    try {
      await clearChatHistory(null);
      console.log("🧪 History cleared");
      setResult("History cleared successfully");
    } catch (error) {
      console.error("🧪 Error:", error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: "fixed", 
      bottom: "100px", 
      right: "20px", 
      background: "white", 
      padding: "20px", 
      border: "2px solid #ccc",
      borderRadius: "8px",
      zIndex: 9999,
      maxWidth: "400px"
    }}>
      <h3>Chat History Debug</h3>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button onClick={testGetHistory} disabled={loading}>
          Test Get History
        </button>
        <button onClick={testClearHistory} disabled={loading}>
          Clear History
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {result && (
        <pre style={{ 
          background: "#f5f5f5", 
          padding: "10px", 
          borderRadius: "4px",
          fontSize: "12px",
          maxHeight: "300px",
          overflow: "auto"
        }}>
          {result}
        </pre>
      )}
    </div>
  );
};

export default ChatHistoryDebug;
