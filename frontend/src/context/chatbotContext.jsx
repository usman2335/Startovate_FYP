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
    location: null,
    // Template-specific context (same as autofill uses)
    templateKey: null,
    fieldHints: null,
    currentAnswers: null,
  });

  const location = useLocation();

  // Context detection logic
  useEffect(() => {
    const detectContext = () => {
      const newContext = {
        canvasId: null,
        templateId: null,
        componentName: null,
        location: location.pathname,
        templateKey: null,
        fieldHints: null,
        currentAnswers: null,
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
      const sessionTemplateKey = sessionStorage.getItem('currentTemplateKey');
      const sessionFieldHints = sessionStorage.getItem('currentFieldHints');
      const sessionCurrentAnswers = sessionStorage.getItem('currentAnswers');

      if (sessionCanvasId) {
        newContext.canvasId = sessionCanvasId;
      }
      if (sessionTemplateId) {
        newContext.templateId = sessionTemplateId;
      }
      if (sessionComponentName) {
        newContext.componentName = sessionComponentName;
      }
      if (sessionTemplateKey) {
        newContext.templateKey = sessionTemplateKey;
      }
      if (sessionFieldHints) {
        try {
          newContext.fieldHints = JSON.parse(sessionFieldHints);
        } catch (e) {
          console.warn('Could not parse fieldHints from session storage');
        }
      }
      if (sessionCurrentAnswers) {
        try {
          newContext.currentAnswers = JSON.parse(sessionCurrentAnswers);
        } catch (e) {
          console.warn('Could not parse currentAnswers from session storage');
        }
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
  const setContextManually = (canvasId, templateId = null, componentName = null, templateData = {}) => {
    const newContext = {
      canvasId,
      templateId,
      componentName,
      location: location.pathname,
      templateKey: templateData.templateKey || null,
      fieldHints: templateData.fieldHints || null,
      currentAnswers: templateData.currentAnswers || null,
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
    if (templateData.templateKey) {
      sessionStorage.setItem('currentTemplateKey', templateData.templateKey);
    }
    if (templateData.fieldHints) {
      sessionStorage.setItem('currentFieldHints', JSON.stringify(templateData.fieldHints));
    }
    if (templateData.currentAnswers) {
      sessionStorage.setItem('currentAnswers', JSON.stringify(templateData.currentAnswers));
    }

    setContext(newContext);
  };

  // Method to clear context
  const clearContext = () => {
    setContext({
      canvasId: null,
      templateId: null,
      componentName: null,
      location: location.pathname,
      templateKey: null,
      fieldHints: null,
      currentAnswers: null,
    });
    
    // Clear session storage
    sessionStorage.removeItem('currentCanvasId');
    sessionStorage.removeItem('currentTemplateId');
    sessionStorage.removeItem('currentComponentName');
    sessionStorage.removeItem('currentTemplateKey');
    sessionStorage.removeItem('currentFieldHints');
    sessionStorage.removeItem('currentAnswers');
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
    if (context.templateKey) {
      summary.push(`TemplateKey: ${context.templateKey}`);
    }
    if (context.componentName) {
      summary.push(`Component: ${context.componentName}`);
    }
    if (context.fieldHints) {
      summary.push(`Fields: ${Object.keys(context.fieldHints).length}`);
    }
    if (context.currentAnswers) {
      summary.push(`Answers: ${Object.keys(context.currentAnswers).length}`);
    }
    summary.push(`Location: ${context.location}`);
    
    return summary.join(' | ') || 'No context detected';
  };

  // Method to get template context for API calls
  const getTemplateContext = () => {
    return {
      templateKey: context.templateKey,
      fieldHints: context.fieldHints,
      currentAnswers: context.currentAnswers,
    };
  };

  const value = {
    context,
    setContext: setContextManually,
    clearContext,
    getContextSummary,
    getTemplateContext,
    // Convenience getters
    hasCanvasContext: !!context.canvasId,
    hasTemplateContext: !!context.templateId,
    hasFullContext: !!(context.canvasId && context.templateId),
    hasTemplateData: !!(context.templateKey && context.fieldHints),
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

export default ChatbotContext;
