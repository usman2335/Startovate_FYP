/**
 * Example React Component demonstrating the Auto-Fill feature
 * 
 * This component shows how to integrate the autofillTemplateFields API
 * into your template components.
 */

import React, { useState } from 'react';
import { autofillTemplateFields } from '../utils/api';

const AutoFillExample = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({
    problem1: '',
    problem2: '',
    problem3: '',
    existingSolutions: '',
  });

  /**
   * Handle auto-fill button click
   */
  const handleAutoFill = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare the payload
      const payload = {
        // Optional: Canvas ID for additional context
        canvasId: 'canvas_123',
        
        // Required: Template identifier
        templateKey: 'problem_identification',
        
        // Optional: Custom system prompt (if not provided, uses default)
        systemPrompt: 'You are helping an entrepreneur develop a Lean Canvas for a mobile app that connects local farmers with consumers.',
        
        // Required: Description of the current step
        stepDescription: 'Identify the top 3 problems that your target customers face',
        
        // Required: Object with field names and their descriptions
        fieldHints: {
          problem1: 'The first and most critical problem your customers face',
          problem2: 'The second most important problem',
          problem3: 'The third problem in order of priority',
          existingSolutions: 'Current alternatives or workarounds customers use',
        },
        
        // Optional: Array of repeated field patterns
        repeatedFields: [],
        
        // Required: Current answers (can be empty or partially filled)
        currentAnswers: answers,
      };

      // Call the API
      const generatedAnswers = await autofillTemplateFields(payload);
      
      // Update the form with generated answers
      setAnswers(generatedAnswers);
      
      console.log('Auto-fill completed successfully!');
    } catch (err) {
      console.error('Auto-fill failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle manual input changes
   */
  const handleInputChange = (field, value) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting answers:', answers);
    // Add your submit logic here
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Problem Identification
          </h2>
          
          {/* Auto-Fill Button */}
          <button
            onClick={handleAutoFill}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating...
              </span>
            ) : (
              '✨ Auto-Fill with AI'
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">Error:</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Problem 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problem 1 (Most Critical)
            </label>
            <textarea
              value={answers.problem1}
              onChange={(e) => handleInputChange('problem1', e.target.value)}
              placeholder="Describe the most critical problem..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Problem 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problem 2
            </label>
            <textarea
              value={answers.problem2}
              onChange={(e) => handleInputChange('problem2', e.target.value)}
              placeholder="Describe the second most important problem..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Problem 3 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problem 3
            </label>
            <textarea
              value={answers.problem3}
              onChange={(e) => handleInputChange('problem3', e.target.value)}
              placeholder="Describe the third problem..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Existing Solutions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Existing Solutions
            </label>
            <textarea
              value={answers.existingSolutions}
              onChange={(e) => handleInputChange('existingSolutions', e.target.value)}
              placeholder="What alternatives or workarounds do customers currently use?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setAnswers({
                problem1: '',
                problem2: '',
                problem3: '',
                existingSolutions: '',
              })}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
            >
              Save Answers
            </button>
          </div>
        </form>
      </div>

      {/* Tips Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Auto-Fill Tips:</h3>
        <ul className="list-disc list-inside text-blue-800 space-y-1">
          <li>Click "Auto-Fill with AI" to generate suggestions for empty fields</li>
          <li>The AI considers any existing answers to maintain consistency</li>
          <li>You can edit or refine the generated suggestions</li>
          <li>Click "Auto-Fill" again to regenerate if you're not satisfied</li>
        </ul>
      </div>
    </div>
  );
};

export default AutoFillExample;


/**
 * INTEGRATION GUIDE
 * 
 * To integrate auto-fill into your existing templates:
 * 
 * 1. Import the API function:
 *    import { autofillTemplateFields } from '../utils/api';
 * 
 * 2. Add state for loading and error:
 *    const [loading, setLoading] = useState(false);
 *    const [error, setError] = useState(null);
 * 
 * 3. Create the handleAutoFill function:
 *    const handleAutoFill = async () => {
 *      setLoading(true);
 *      setError(null);
 *      try {
 *        const payload = {
 *          templateKey: 'your_template_key',
 *          stepDescription: 'Description of this step',
 *          fieldHints: {
 *            field1: 'Description of field 1',
 *            field2: 'Description of field 2',
 *          },
 *          currentAnswers: yourCurrentAnswers,
 *        };
 *        const generatedAnswers = await autofillTemplateFields(payload);
 *        // Update your state with generatedAnswers
 *      } catch (err) {
 *        setError(err.message);
 *      } finally {
 *        setLoading(false);
 *      }
 *    };
 * 
 * 4. Add the Auto-Fill button to your UI:
 *    <button onClick={handleAutoFill} disabled={loading}>
 *      {loading ? 'Generating...' : '✨ Auto-Fill with AI'}
 *    </button>
 * 
 * 5. Display error messages if needed:
 *    {error && <div className="error">{error}</div>}
 */

