import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';
import { getOpenAIApiKey } from '../utils/apiConfig';

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
  | 'Announcement'
  | 'FOMO (Fear of Missing Out)'
  | 'Problem-Solution'
  | 'Social Proof'
  | 'Special Offer'
  | 'Seasonal/Holiday'
  | 'Instructional/How-To'
  | 'News/Update'
  | 'Storytelling'
  | 'Direct/Straightforward'
  | 'Emotional Appeal';

interface GeneratedSubject {
  text: string;
  previewText: string;
  style: SubjectStyle;
}

// Get API key using our utility (will be lazy loaded when needed)
let OPENAI_API_KEY: string | undefined;

// Add descriptions for each subject line style
const styleDescriptions: Record<SubjectStyle, string> = {
  'Curiosity': 'Pique interest with intriguing, incomplete information',
  'Prelaunch': 'Build anticipation for upcoming products or services',
  'Cart Open': 'Announce that orders are now available',
  'Closing Scarcity': 'Create urgency around final availability',
  'Extra Bonus': 'Highlight additional value or unexpected perks',
  'Time Sensitive': 'Emphasize limited-time availability',
  'Personalized': 'Craft tailored, individual-focused messages',
  'Value Proposition': 'Clearly communicate benefits and advantages',
  'Question-Based': 'Engage with thought-provoking questions',
  'Announcement': 'Share news, updates, or important information',
  'FOMO (Fear of Missing Out)': 'Tap into anxiety of being left out',
  'Problem-Solution': 'Identify pain points and offer remedies',
  'Social Proof': 'Leverage testimonials and public validation',
  'Special Offer': 'Highlight deals, discounts and promotions',
  'Seasonal/Holiday': 'Connect with timely events and celebrations',
  'Instructional/How-To': 'Promise educational or tutorial content',
  'News/Update': 'Share recent developments or changes',
  'Storytelling': 'Begin a narrative that continues in the email',
  'Direct/Straightforward': 'Simple, clear, and to-the-point messaging',
  'Emotional Appeal': 'Connect through feelings and emotional triggers'
};

const SubjectGenerator: React.FC = () => {
  const [description, setDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<SubjectStyle>('Curiosity');
  const [generatedSubjects, setGeneratedSubjects] = useState<GeneratedSubject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<{subject?: number; preview?: number} | null>(null);
  
  // Feature toggles
  const [useEmojis, setUseEmojis] = useState(false);
  const [usePersonalization, setUsePersonalization] = useState(false);
  const [useUrgency, setUseUrgency] = useState(false);
  const [useBrief, setUseBrief] = useState(false);

  // All available styles
  const subjectStyles: SubjectStyle[] = [
    'Curiosity',
    'Prelaunch',
    'Cart Open',
    'Closing Scarcity',
    'Extra Bonus',
    'Time Sensitive',
    'Personalized',
    'Value Proposition',
    'Question-Based',
    'Announcement',
    'FOMO (Fear of Missing Out)',
    'Problem-Solution',
    'Social Proof',
    'Special Offer',
    'Seasonal/Holiday',
    'Instructional/How-To',
    'News/Update',
    'Storytelling',
    'Direct/Straightforward',
    'Emotional Appeal'
  ];

  // Get API key on component initialization or when needed
  useEffect(() => {
    // We don't need to set it immediately, just when generating
    if (!OPENAI_API_KEY) {
      console.log('Environment check for OpenAI API key');
    }
  }, []);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStyle(e.target.value as SubjectStyle);
  };

  const copyToClipboard = (text: string, index: number, type: 'subject' | 'preview') => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(type === 'subject' ? { subject: index } : { preview: index });
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

    // Get the API key only when needed
    if (!OPENAI_API_KEY) {
      OPENAI_API_KEY = getOpenAIApiKey();
    }

    if (!OPENAI_API_KEY) {
      setError('OpenAI API key is not configured. Please check your environment variables or Vercel configuration.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true // This is necessary for client-side use
      });

      const featureInstructions = [
        useEmojis ? '• Include 1 relevant emoji in each subject line (placed thoughtfully, not just at the beginning).' : '• Do not use emojis unless specified in style.',
        usePersonalization ? '• Include {{subscriber_name}} personalization in each subject line where it naturally fits.' : '• Do not use personalization tokens.',
        useUrgency ? '• Include a sense of urgency in the subject lines without using spam trigger words.' : '',
        useBrief ? '• Keep subject lines under 40 characters when possible.' : '• Aim for 50-60 characters in subject lines.'
      ].filter(instruction => instruction).join('\n');

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // Using the latest available model
        messages: [
          {
            role: "system",
            content: `You are a world-class email copywriter and deliverability strategist.

OBJECTIVE  
Generate exactly **5** unique email packages, each with:
1. A high-converting subject line
2. A complementary preview text (40-90 characters) that gets more opens

SUBJECT LINE CONSTRAINTS  
• ≤ 80 characters each (count every space & punctuation).  
• No ALL-CAPS words, no more than one "!" or "?" total.  
• Avoid common spam-trigger words (e.g. "Free", "Urgent", "100%-off") or excessive symbols.  
${featureInstructions}
• Each line must carry at least one of these psychological hooks: curiosity, clear benefit, social proof, urgency, or exclusivity.  
• Language & tone must match **"${selectedStyle}"** style.  
• Lines should be meaningfully different from one another (no tiny wording tweaks).  

PREVIEW TEXT GUIDELINES
• Should complement and expand on the subject line, not repeat it
• Create intrigue and provide additional value or context
• Match the tone of the subject line
• Keep under 90 characters for ideal inbox display
• Never mislead - must be directly relevant to the email content
• Should flow naturally from the subject line when read together

PROCESS (silent)  
1. Brainstorm at least 10 candidate subject lines.  
2. Score them for hook strength, clarity, spam-risk, and length.  
3. Create a complementary preview text for the top 5 subject lines.
4. Return results in the specified JSON format.`
          },
          {
            role: "user",
            content: `Create 5 email subject lines with preview text for an email about: "${description}".
            The style should be: ${selectedStyle}
            Format the response as a JSON object with an array of objects containing "subject" and "previewText" fields.`
          }
        ],
        response_format: { type: "json_object" }
      });

      // Parse the response as JSON
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const parsedContent = JSON.parse(content);
      const subjectLines = parsedContent.subject_lines || parsedContent.subjectLines || [];
      
      if (!Array.isArray(subjectLines) || subjectLines.length === 0) {
        throw new Error('Invalid response format from OpenAI');
      }

      // Create an array of GeneratedSubject objects
      const subjects: GeneratedSubject[] = subjectLines.map((item: any) => ({
        text: item.subject || item.text,
        previewText: item.previewText || item.preview || 'Preview text not generated',
        style: selectedStyle
      }));

      setGeneratedSubjects(subjects);
    } catch (err) {
      console.error('Error generating subject lines:', err);
      setError('Failed to generate subject lines. Please check your API key or try again later.');
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
        <div className="relative">
          <select
            className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 appearance-none"
            value={selectedStyle}
            onChange={handleStyleChange}
          >
            {subjectStyles.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
          {styleDescriptions[selectedStyle]}
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
          Subject Line Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setUseEmojis(!useEmojis)}
            className={`feature-card flex items-center p-4 rounded-lg transition-all duration-200 ${
              useEmojis 
                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 shadow-md' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            } border-2`}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              useEmojis 
                ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm-4.34 7.964a.75.75 0 01-1.061-1.06 5.236 5.236 0 013.73-1.538 5.236 5.236 0 013.695 1.538.75.75 0 11-1.061 1.06 3.736 3.736 0 00-2.639-1.098 3.736 3.736 0 00-2.664 1.098z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4 text-left">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Include Emojis</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Add relevant emojis to subject lines</p>
            </div>
            <div className="ml-auto">
              {useEmojis && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setUsePersonalization(!usePersonalization)}
            className={`feature-card flex items-center p-4 rounded-lg transition-all duration-200 ${
              usePersonalization 
                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 shadow-md' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            } border-2`}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              usePersonalization 
                ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4 text-left">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Use Personalization</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Add {'{'}subscriber_name{'}'} to subject line</p>
            </div>
            <div className="ml-auto">
              {usePersonalization && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setUseUrgency(!useUrgency)}
            className={`feature-card flex items-center p-4 rounded-lg transition-all duration-200 ${
              useUrgency 
                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 shadow-md' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            } border-2`}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              useUrgency 
                ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4 text-left">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Add Urgency</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Create time-sensitive feel</p>
            </div>
            <div className="ml-auto">
              {useUrgency && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setUseBrief(!useBrief)}
            className={`feature-card flex items-center p-4 rounded-lg transition-all duration-200 ${
              useBrief 
                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 shadow-md' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            } border-2`}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              useBrief 
                ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 8.703a4.126 4.126 0 017.746 0 .75.75 0 01-.351.92 7.47 7.47 0 01-3.522.877 7.47 7.47 0 01-3.522-.877.75.75 0 01-.351-.92zM15 8.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15zM14.25 12a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H15a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4 text-left">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Keep Brief</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Short subject lines under 40 chars</p>
            </div>
            <div className="ml-auto">
              {useBrief && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </div>

      <button
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-md flex items-center justify-center"
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
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
            Generate Subject Lines & Preview Text
          </>
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
            Generated Email Content ({selectedStyle})
          </h3>
          <ul className="space-y-6">
            {generatedSubjects.map((subject, index) => (
              <li 
                key={index}
                className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                {/* Subject Line */}
                <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-t-md flex justify-between items-center">
                  <div className="flex items-start">
                    <span className="inline-block bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200 text-xs font-medium py-1 px-2 rounded-full mr-2">
                      Subject
                    </span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{subject.text}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(subject.text, index, 'subject')}
                    className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex-shrink-0"
                    title="Copy subject line"
                  >
                    {copied?.subject === index ? (
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
                </div>
                
                {/* Preview Text */}
                <div className="p-3 bg-green-50 dark:bg-green-900 rounded-b-md flex justify-between items-center">
                  <div className="flex items-start">
                    <span className="inline-block bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 text-xs font-medium py-1 px-2 rounded-full mr-2">
                      Preview
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{subject.previewText}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(subject.previewText, index, 'preview')}
                    className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 flex-shrink-0"
                    title="Copy preview text"
                  >
                    {copied?.preview === index ? (
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
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p>
          This tool uses OpenAI's API to generate engaging subject lines and preview text based on your input.
          Generated content may require review and editing to match your brand voice.
        </p>
      </div>
    </div>
  );
};

export default SubjectGenerator; 