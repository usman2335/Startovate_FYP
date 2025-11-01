import React, { useState } from "react";
import {
  formatChatbotResponse,
  stripMarkdown,
  markdownToSafeHTML,
} from "../utils/chatbotTextProcessor";

/**
 * Demo component to showcase chatbot text processing improvements
 * This component demonstrates how markdown is cleaned and processed
 */
const ChatbotTextProcessorDemo = () => {
  const [inputText, setInputText] = useState(`# Welcome to LCI Assistant!

This is a **bold** statement and this is *italic* text.

Here's a list:
- First item
- Second item
- Third item

\`\`\`javascript
console.log("Code block example");
\`\`\`

You can also use \`inline code\` in your text.

**Important:** This text contains markdown syntax that will be cleaned!`);

  const [processingMode, setProcessingMode] = useState("strip");

  const processedText = formatChatbotResponse(inputText, {
    mode: processingMode,
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🤖 Chatbot Text Processor Demo
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Raw Input (with Markdown)
          </h3>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm"
            placeholder="Enter text with markdown syntax..."
          />

          <div className="flex space-x-4">
            <button
              onClick={() => setProcessingMode("strip")}
              className={`px-4 py-2 rounded-lg ${
                processingMode === "strip"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Strip Markdown
            </button>
            <button
              onClick={() => setProcessingMode("html")}
              className={`px-4 py-2 rounded-lg ${
                processingMode === "html"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Convert to HTML
            </button>
            <button
              onClick={() => setProcessingMode("raw")}
              className={`px-4 py-2 rounded-lg ${
                processingMode === "raw"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Raw Text
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Processed Output
          </h3>
          <div className="h-64 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto">
            {processingMode === "html" ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: processedText.text }}
              />
            ) : (
              <div
                className="whitespace-pre-wrap text-sm"
                dangerouslySetInnerHTML={{ __html: processedText.text }}
              />
            )}
          </div>

          <div className="text-sm text-gray-600">
            <strong>Mode:</strong> {processingMode} |<strong> HTML:</strong>{" "}
            {processedText.isHTML ? "Yes" : "No"}
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">
          ✨ Features Implemented:
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
          <li>
            ✅ Removes raw markdown syntax (**bold**, *italic*, # headers)
          </li>
          <li>✅ Converts newlines to &lt;br/&gt; tags</li>
          <li>✅ Preserves basic formatting (strong, em)</li>
          <li>✅ Sanitizes HTML to prevent XSS attacks</li>
          <li>✅ Typing animation for chatbot responses</li>
          <li>✅ Enhanced chat bubble design</li>
          <li>✅ Responsive design for all screen sizes</li>
          <li>✅ Clean, readable plain text output</li>
        </ul>
      </div>
    </div>
  );
};

export default ChatbotTextProcessorDemo;
