import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ChatbotContext = createContext();

export const useChatbotContext = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbotContext must be used within a ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const [context, setContext] = useState({
    canvasId: null,
    templateId: null,
    componentName: null,
    location: null
  });

  const location = useLocation();

  // Context detection logic
  useEffect(() => {
    const detectContext = () => {
      const newContext = {
        canvasId: null,
        templateId: null,
        componentName: null,
        location: location.pathname
      };

      // Try to get context from URL parameters
      const urlParams = new URLSearchParams(location.search);
      const canvasIdFromUrl = urlParams.get('canvasId');
      const templateIdFromUrl = urlParams.get('templateId');

      if (canvasIdFromUrl) {
        newContext.canvasId = canvasIdFromUrl;
      }
      if (templateIdFromUrl) {
        newContext.templateId = templateIdFromUrl;
      }

      // Try to get context from sessionStorage (set by components)
      const sessionCanvasId = sessionStorage.getItem('currentCanvasId');
      const sessionTemplateId = sessionStorage.getItem('currentTemplateId');
      const sessionComponentName = sessionStorage.getItem('currentComponentName');

      if (sessionCanvasId) {
        newContext.canvasId = sessionCanvasId;
      }
      if (sessionTemplateId) {
        newContext.templateId = sessionTemplateId;
      }
      if (sessionComponentName) {
        newContext.componentName = sessionComponentName;
      }

      // Try to get context from localStorage (persistent across sessions)
      const localCanvasId = localStorage.getItem('userCanvasId');
      if (localCanvasId && !newContext.canvasId) {
        newContext.canvasId = localCanvasId;
      }

      setContext(newContext);
    };

    detectContext();
  }, [location]);

  // Method to manually set context (called by components)
  const setContextManually = (canvasId, templateId = null, componentName = null) => {
    const newContext = {
      canvasId,
      templateId,
      componentName,
      location: location.pathname
    };

    // Update session storage
    if (canvasId) {
      sessionStorage.setItem('currentCanvasId', canvasId);
      localStorage.setItem('userCanvasId', canvasId);
    }
    if (templateId) {
      sessionStorage.setItem('currentTemplateId', templateId);
    }
    if (componentName) {
      sessionStorage.setItem('currentComponentName', componentName);
    }

    setContext(newContext);
  };

  // Method to clear context
  const clearContext = () => {
    setContext({
      canvasId: null,
      templateId: null,
      componentName: null,
      location: location.pathname
    });
    
    // Clear session storage
    sessionStorage.removeItem('currentCanvasId');
    sessionStorage.removeItem('currentTemplateId');
    sessionStorage.removeItem('currentComponentName');
  };

  // Method to get context summary for debugging
  const getContextSummary = () => {
    const summary = [];
    
    if (context.canvasId) {
      summary.push(`Canvas: ${context.canvasId}`);
    }
    if (context.templateId) {
      summary.push(`Template: ${context.templateId}`);
    }
    if (context.componentName) {
      summary.push(`Component: ${context.componentName}`);
    }
    summary.push(`Location: ${context.location}`);
    
    return summary.join(' | ') || 'No context detected';
  };

  const value = {
    context,
    setContext: setContextManually,
    clearContext,
    getContextSummary,
    // Convenience getters
    hasCanvasContext: !!context.canvasId,
    hasTemplateContext: !!context.templateId,
    hasFullContext: !!(context.canvasId && context.templateId)
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

export default ChatbotContext;
