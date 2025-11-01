import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, X, Minimize2 } from "lucide-react";
import { sendChatMessage, getChatbotStatus } from "../utils/api";
import { useChatbotContext } from "../context/chatbotContext";
import { formatChatbotResponse, typeText } from "../utils/chatbotTextProcessor";
import "../CSS/FloatingChat.css";

const FloatingChat = ({ onClose }) => {
  const { context, getContextSummary } = useChatbotContext();

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello! I'm your LCI assistant. ${
        context.canvasId
          ? `I can see you're working on canvas ${context.canvasId}. `
          : ""
      }How can I help you today?`,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check connection status on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const status = await getChatbotStatus();
        setIsConnected(status.success && status.data.status === "online");
      } catch (error) {
        console.log("Chatbot backend not available:", error.message);
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      console.log("Sending message to chatbot:", inputMessage);
      console.log("Context being sent:", getContextSummary());
      const data = await sendChatMessage(inputMessage, 3, context);
      console.log("Received response from chatbot:", data);

      const botMessage = {
        id: Date.now() + 1,
        text: data.answer,
        sender: "bot",
        timestamp: new Date(),
        isTyping: true, // Add typing animation flag
      };

      setMessages((prev) => [...prev, botMessage]);

      // Start typing animation
      const formattedResponse = formatChatbotResponse(data.answer, {
        mode: "strip",
      });
      let currentText = "";

      const typingTimer = typeText(
        formattedResponse.text,
        (typedText) => {
          currentText = typedText;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessage.id
                ? { ...msg, text: typedText, isTyping: true }
                : msg
            )
          );
        },
        5
      );

      // Complete typing animation
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessage.id
              ? { ...msg, text: formattedResponse.text, isTyping: false }
              : msg
          )
        );
      }, formattedResponse.text.length * 5 + 200);
    } catch (error) {
      console.error("Error sending message:", error);
      console.error("Error details:", error.response?.data || error.message);

      let errorText =
        "I'm sorry, I'm having trouble connecting to the chatbot service.";

      if (
        error.code === "ECONNREFUSED" ||
        error.message.includes("Network Error")
      ) {
        errorText += " Please make sure the LCI ChatBot backend is running.";
      } else if (error.response?.status === 500) {
        errorText += " The chatbot service encountered an internal error.";
      } else if (error.response?.status === 404) {
        errorText += " The chatbot endpoint was not found.";
      } else {
        errorText += ` Error: ${error.message}`;
      }

      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="floating-chat-container">
      {/* Header */}
      <div className="floating-chat-header">
        <div className="floating-chat-title">
          <Bot size={20} />
          <span>LCI Assistant</span>
          <div className="connection-indicator">
            <div
              className={`status-dot ${
                isConnected ? "connected" : "disconnected"
              }`}
            ></div>
          </div>
        </div>
        <div className="floating-chat-actions">
          <button className="action-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Context Indicator */}
      {context.canvasId && (
        <div className="floating-context-indicator">
          <span className="context-label">
            {context.templateId
              ? `Template: ${context.templateId}`
              : `Canvas: ${context.canvasId}`}
          </span>
        </div>
      )}

      {/* Messages */}
      <div className="floating-chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`floating-message ${message.sender}`}
          >
            <div className="floating-message-avatar">
              {message.sender === "user" ? (
                <User size={16} />
              ) : (
                <Bot size={16} />
              )}
            </div>
            <div className="floating-message-content">
              <div
                className="floating-message-text"
                dangerouslySetInnerHTML={{
                  __html: message.text,
                }}
              />
              <div className="floating-message-time">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="floating-message bot">
            <div className="floating-message-avatar">
              <Bot size={16} />
            </div>
            <div className="floating-message-content">
              <div className="floating-message-text loading">
                <Loader2 className="loading-spinner" size={14} />
                Thinking...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="floating-chat-input-container">
        <div className="floating-chat-input-wrapper">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about LCI..."
            className="floating-chat-input"
            rows="1"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="floating-send-button"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingChat;
