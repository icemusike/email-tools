import React, { useState } from 'react';
import OpenAI from 'openai';

// Define subject line styles
type SubjectStyle = 
  | 'Prelaunch' 
  | 'Cart Open' 
  | 'Curiosity' 
  | 'Closing Scarcity' 
  | 'Extra Bonus' 
  | 'Time Sensitive' 
  | 'Personalized' 
  | 'Value Proposition' 
  | 'Question-Based' 
  | 'Announcement';

interface GeneratedSubject {
  text: string;
  style: SubjectStyle;
}

const SubjectGenerator: React.FC = () => {
  const [description, setDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<SubjectStyle>('Curiosity');
  const [generatedSubjects, setGeneratedSubjects] = useState<GeneratedSubject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  // All available styles
  const subjectStyles: SubjectStyle[] = [
    'Prelaunch',
    'Cart Open',
    'Curiosity',
    'Closing Scarcity',
    'Extra Bonus',
    'Time Sensitive',
    'Personalized',
    'Value Proposition',
    'Question-Based',
    'Announcement'
  ];

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStyle(e.target.value as SubjectStyle);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(index);
        setTimeout(() => setCopied(null), 2000);
      })
      .catch(() => {
        setError('Failed to copy to clipboard');
      });
  };

  const generateSubjects = async () => {
    if (!description.trim()) {
      setError('Please enter a description of your email');
      return;
    }

    if (!apiKey && !showApiKeyInput) {
      setShowApiKeyInput(true);
      return;
    }

    if (!apiKey && showApiKeyInput) {
      setError('Please enter your OpenAI API key');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // This is necessary for client-side use
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // Using the latest available model
        messages: [
          {
            role: "system",
            content: `You are an expert email marketer specializing in crafting high-converting subject lines.
            Your task is to generate 5 unique, creative email subject lines in the "${selectedStyle}" style.
            Keep each subject line under 50 characters and engaging.
            Do not include any explanations or formatting, just provide the subject lines as a JSON array.`
          },
          {
            role: "user",
            content: `Create 5 email subject lines for an email about: "${description}".
            The style should be: ${selectedStyle}
            Format the response as a JSON array of strings.`
          }
        ],
        response_format: { type: "json_object" }
      });

      // Parse the response as JSON
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const subjectLines = JSON.parse(content).subject_lines;
      if (!Array.isArray(subjectLines)) {
        throw new Error('Invalid response format from OpenAI');
      }

      // Create an array of GeneratedSubject objects
      const subjects: GeneratedSubject[] = subjectLines.map((text: string) => ({
        text,
        style: selectedStyle
      }));

      setGeneratedSubjects(subjects);
    } catch (err) {
      console.error('Error generating subject lines:', err);
      setError('Failed to generate subject lines. Please try again or check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">AI Subject Line Generator</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          What is your email about?
        </label>
        <textarea
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
          rows={4}
          placeholder="Describe your email content, campaign, or offer. The more details, the better the results."
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Subject Line Style
        </label>
        <select
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
          value={selectedStyle}
          onChange={handleStyleChange}
        >
          {subjectStyles.map((style) => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Select the tone and approach for your subject lines
        </p>
      </div>

      {showApiKeyInput && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            OpenAI API Key
          </label>
          <input
            type="password"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Enter your OpenAI API key"
            value={apiKey}
            onChange={handleApiKeyChange}
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your API key is used only for this request and is not stored
          </p>
        </div>
      )}

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
        onClick={generateSubjects}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          showApiKeyInput && !apiKey ? 'Continue with API Key' : 'Generate Subject Lines'
        )}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {generatedSubjects.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Generated Subject Lines ({selectedStyle})
          </h3>
          <ul className="space-y-3">
            {generatedSubjects.map((subject, index) => (
              <li 
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-gray-800 dark:text-gray-200">{subject.text}</span>
                <button
                  onClick={() => copyToClipboard(subject.text, index)}
                  className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  title="Copy to clipboard"
                >
                  {copied === index ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                      <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p>
          This tool uses OpenAI's API to generate subject lines based on your input.
          Generated content may require review and editing to match your brand voice.
        </p>
      </div>
    </div>
  );
};

export default SubjectGenerator; 