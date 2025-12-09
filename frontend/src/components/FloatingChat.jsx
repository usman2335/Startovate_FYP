import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Minimize2 } from "lucide-react";
import {
  sendChatMessage,
  getChatbotStatus,
  getChatHistory,
  clearChatHistory,
} from "../utils/api";
import { useChatbotContext } from "../context/chatbotContext";
import { formatChatbotResponse, typeText } from "../utils/chatbotTextProcessor";
import "../CSS/FloatingChat.css";

const FloatingChat = ({ onClose }) => {
  const { context, getContextSummary, getTemplateContext } =
    useChatbotContext();

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history and check connection on component mount
  useEffect(() => {
    console.log("🚀 FloatingChat useEffect triggered - initializing chat");

    const initializeChat = async () => {
      // Check connection
      try {
        const status = await getChatbotStatus();
        setIsConnected(status.success && status.data.status === "online");
        console.log(
          "🔌 Connection status:",
          status.success ? "online" : "offline"
        );
      } catch (error) {
        console.log("Chatbot backend not available:", error.message);
        setIsConnected(false);
      }

      // Load chat history
      try {
        setIsLoadingHistory(true);
        console.log("🔍 Loading chat history for canvasId:", context.canvasId);
        const history = await getChatHistory(context.canvasId);
        console.log("📥 Received history:", JSON.stringify(history, null, 2));

        console.log("🔍 Checking history:", {
          hasHistory: history.hasHistory,
          messagesLength: history.messages?.length,
          messages: history.messages,
        });

        if (
          history.hasHistory &&
          history.messages &&
          history.messages.length > 0
        ) {
          console.log("📝 Converting messages to UI format...");
          // Convert database messages to UI format
          const formattedMessages = history.messages.map((msg, index) => {
            console.log(`  Message ${index}:`, msg);
            return {
              id: index + 1,
              text: msg.content,
              sender: msg.role === "user" ? "user" : "bot",
              timestamp: new Date(msg.timestamp),
            };
          });
          console.log("📝 Formatted messages:", formattedMessages);
          setMessages(formattedMessages);
          console.log(
            `✅ Loaded ${formattedMessages.length} messages from history`
          );
          console.log("✅ Messages state should now be:", formattedMessages);
        } else {
          console.log("ℹ️ No history found, showing welcome message");
          // Show welcome message if no history
          setMessages([
            {
              id: 1,
              text: `Hello! I'm your LCI assistant. ${
                context.canvasId ? `I can see you're working on a canvas. ` : ""
              }How can I help you today?`,
              sender: "bot",
              timestamp: new Date(),
            },
          ]);
        }
      } catch (error) {
        console.error("❌ Error loading chat history:", error);
        // Show welcome message on error
        setMessages([
          {
            id: 1,
            text: `Hello! I'm your LCI assistant. How can I help you today?`,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    initializeChat();
  }, [context.canvasId]); // Reload when canvasId changes or component mounts

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
      const templateContext = getTemplateContext();
      console.log("Template context:", templateContext);
      const data = await sendChatMessage(
        inputMessage,
        3,
        context,
        templateContext
      );
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

  const handleClearHistory = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear your chat history? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      await clearChatHistory(context.canvasId);
      setMessages([
        {
          id: Date.now(),
          text: `Chat history cleared. How can I help you today?`,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      console.log("✅ Chat history cleared");
    } catch (error) {
      console.error("Error clearing chat history:", error);
      alert("Failed to clear chat history. Please try again.");
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
          <button
            className="action-btn"
            onClick={handleClearHistory}
            title="Clear chat history"
          >
            🗑️
          </button>
          <button className="action-btn" onClick={onClose}>
            ×
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
        {isLoadingHistory ? (
          <div className="floating-message bot">
            <div className="floating-message-avatar">
              <Bot size={16} />
            </div>
            <div className="floating-message-content">
              <div className="floating-message-text loading">
                <Loader2 className="loading-spinner" size={14} />
                Loading chat history...
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
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
          ))
        )}
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
