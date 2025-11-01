import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Wifi, WifiOff } from "lucide-react";
import { sendChatMessage, checkChatbotHealth } from "../utils/api";
import { formatChatbotResponse, typeText } from "../utils/chatbotTextProcessor";
import "../CSS/ChatPage.css";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your LCI (Lean Canvas for Invention) assistant. I can help you with questions about the LCI methodology, problem identification, market research, and more. How can I assist you today?",
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
        await checkChatbotHealth();
        setIsConnected(true);
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
      const data = await sendChatMessage(inputMessage, 3);
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

      const typingTimer = typeText(
        formattedResponse.text,
        (typedText) => {
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
        errorText +=
          " Please make sure the LCI ChatBot backend is running on port 8000.";
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
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-title">
            <Bot className="chat-icon" />
            <h2>LCI Assistant</h2>
            <div className="connection-status">
              {isConnected ? (
                <Wifi className="connection-icon connected" size={16} />
              ) : (
                <WifiOff className="connection-icon disconnected" size={16} />
              )}
            </div>
          </div>
          <p className="chat-subtitle">
            Your Lean Canvas for Invention guide
            {!isConnected && (
              <span className="connection-warning">
                {" "}
                (Backend offline - Please start the chatbot service)
              </span>
            )}
          </p>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-avatar">
                {message.sender === "user" ? (
                  <User size={20} />
                ) : (
                  <Bot size={20} />
                )}
              </div>
              <div className="message-content">
                <div
                  className="message-text"
                  dangerouslySetInnerHTML={{
                    __html: message.text,
                  }}
                />
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message bot">
              <div className="message-avatar">
                <Bot size={20} />
              </div>
              <div className="message-content">
                <div className="message-text loading">
                  <Loader2 className="loading-spinner" />
                  Thinking...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about LCI methodology..."
              className="chat-input"
              rows="1"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="send-button"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
