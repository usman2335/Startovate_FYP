import DOMPurify from "dompurify";
import { marked } from "marked";

/**
 * Utility functions for processing chatbot response text
 * Removes raw markdown syntax and provides clean text rendering
 */

/**
 * Simple markdown stripper - removes markdown syntax but keeps content
 * @param {string} text - Raw text with markdown syntax
 * @returns {string} - Clean plain text
 */
export const stripMarkdown = (text) => {
  if (!text) return "";

  return (
    text
      // Remove bold/italic markers
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/__(.*?)__/g, "$1")
      .replace(/_(.*?)_/g, "$1")
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`(.*?)`/g, "$1")
      // Remove headers
      .replace(/^#{1,6}\s+/gm, "")
      // Remove list markers
      .replace(/^[\s]*[-*+]\s+/gm, "• ")
      .replace(/^[\s]*\d+\.\s+/gm, "")
      // Remove horizontal rules
      .replace(/^[\s]*[-*_]{3,}[\s]*$/gm, "")
      // Remove links but keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Remove images
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
      // Clean up extra whitespace
      .replace(/\n\s*\n\s*\n/g, "\n\n")
      .trim()
  );
};

/**
 * Convert markdown to safe HTML with sanitization
 * @param {string} text - Raw text with markdown syntax
 * @returns {string} - Sanitized HTML
 */
export const markdownToSafeHTML = (text) => {
  if (!text) return "";

  try {
    // Configure marked options for safer rendering
    marked.setOptions({
      breaks: true, // Convert \n to <br>
      gfm: true, // GitHub Flavored Markdown
      sanitize: false, // We'll use DOMPurify instead
    });

    // Convert markdown to HTML
    const html = marked.parse(text);

    // Sanitize HTML to prevent XSS attacks
    const cleanHTML = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "b",
        "i",
        "u",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "blockquote",
        "code",
        "pre",
        "a",
        "span",
        "div",
      ],
      ALLOWED_ATTR: ["href", "target", "rel"],
      ALLOW_DATA_ATTR: false,
    });

    return cleanHTML;
  } catch (error) {
    console.error("Error processing markdown:", error);
    return stripMarkdown(text); // Fallback to plain text
  }
};

/**
 * Process chatbot response text with multiple options
 * @param {string} text - Raw chatbot response
 * @param {Object} options - Processing options
 * @param {boolean} options.stripMarkdown - Remove all markdown syntax
 * @param {boolean} options.convertToHTML - Convert to safe HTML
 * @param {boolean} options.preserveLineBreaks - Convert \n to <br>
 * @returns {string} - Processed text
 */
export const processChatbotResponse = (text, options = {}) => {
  if (!text) return "";

  const {
    stripMarkdown: strip = true,
    convertToHTML = false,
    preserveLineBreaks = true,
  } = options;

  let processedText = text;

  if (strip && !convertToHTML) {
    // Simple markdown stripping
    processedText = stripMarkdown(text);

    if (preserveLineBreaks) {
      processedText = processedText.replace(/\n/g, "<br/>");
    }
  } else if (convertToHTML) {
    // Convert to safe HTML
    processedText = markdownToSafeHTML(text);
  }

  return processedText;
};

/**
 * Create a typing animation effect for chatbot responses
 * @param {string} text - Text to animate
 * @param {Function} callback - Callback function to update UI
 * @param {number} speed - Typing speed in milliseconds
 */
export const typeText = (text, callback, speed = 5) => {
  let index = 0;
  const timer = setInterval(() => {
    if (index < text.length) {
      callback(text.slice(0, index + 1));
      index++;
    } else {
      clearInterval(timer);
    }
  }, speed);

  return timer;
};

/**
 * Format chatbot response for display
 * @param {string} text - Raw chatbot response
 * @param {Object} options - Formatting options
 * @returns {Object} - Formatted response object
 */
export const formatChatbotResponse = (text, options = {}) => {
  const {
    mode = "strip", // 'strip', 'html', 'raw'
    enableTyping = false,
    typingSpeed = 5,
  } = options;

  let processedText;

  switch (mode) {
    case "html":
      processedText = processChatbotResponse(text, {
        stripMarkdown: false,
        convertToHTML: true,
        preserveLineBreaks: true,
      });
      break;
    case "raw":
      processedText = text;
      break;
    case "strip":
    default:
      processedText = processChatbotResponse(text, {
        stripMarkdown: true,
        convertToHTML: false,
        preserveLineBreaks: true,
      });
      break;
  }

  return {
    text: processedText,
    isHTML: mode === "html",
    enableTyping,
    typingSpeed,
  };
};
