// ChatbotFloating.jsx
import React, { useState } from "react";
import FloatingChat from "./FloatingChat";
import { MessageCircle } from "lucide-react";
import "../CSS/ChatbotFloating.css";

const ChatbotFloating = () => {
  const [showChat, setShowChat] = useState(false);

  // Debug: Log when component mounts
  React.useEffect(() => {
    console.log("ChatbotFloating component mounted");
  }, []);

  return (
    <>
      <button
        className="chatbot-floating-button"
        onClick={() => setShowChat(!showChat)}
        title="Open LCI Assistant"
      >
        <MessageCircle size={24} />
      </button>

      {showChat && (
        <div className="chatbot-floating-window">
          <FloatingChat onClose={() => setShowChat(false)} />
        </div>
      )}
    </>
  );
};

export default ChatbotFloating;
