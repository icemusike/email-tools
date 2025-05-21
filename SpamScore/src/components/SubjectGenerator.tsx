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

// Define an interface for favorite emails
interface FavoriteEmail {
  id: string;
  subject: string;
  body: string;
  date: string;
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
  const [copied, setCopied] = useState<{subject?: number; preview?: number; body?: boolean} | null>(null);
  
  // Add state to track which subject line has the email composer open
  const [emailComposerOpen, setEmailComposerOpen] = useState<number | null>(null);
  const [emailBody, setEmailBody] = useState<string>('');
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [emailGenerationError, setEmailGenerationError] = useState<string | null>(null);
  
  // Add state for favorites
  const [favorites, setFavorites] = useState<FavoriteEmail[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  
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

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('emailFavorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error('Error parsing stored favorites:', e);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('emailFavorites', JSON.stringify(favorites));
  }, [favorites]);

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

OUTPUT FORMATTING
You must format your response as a JSON object with EXACTLY this structure:
{
  "subject_lines": [
    {
      "subject": "First subject line text here",
      "previewText": "First preview text here"
    },
    {
      "subject": "Second subject line text here",
      "previewText": "Second preview text here"
    }
    // and so on for all 5 subject lines
  ]
}

Make sure to use the EXACT property names shown above: "subject_lines", "subject", and "previewText".`
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

      console.log('Raw OpenAI response:', content);
      
      try {
        const parsedContent = JSON.parse(content);
        console.log('Parsed content structure:', JSON.stringify(parsedContent, null, 2));
        
        // Try multiple possible response formats
        let subjectLines: any[] = [];
        
        if (parsedContent.subject_lines && Array.isArray(parsedContent.subject_lines)) {
          subjectLines = parsedContent.subject_lines;
        } else if (parsedContent.subjectLines && Array.isArray(parsedContent.subjectLines)) {
          subjectLines = parsedContent.subjectLines;
        } else if (parsedContent.subjects && Array.isArray(parsedContent.subjects)) {
          subjectLines = parsedContent.subjects;
        } else if (parsedContent.lines && Array.isArray(parsedContent.lines)) {
          subjectLines = parsedContent.lines;
        } else if (Array.isArray(parsedContent)) {
          // Maybe the response is directly an array
          subjectLines = parsedContent;
        } else {
          // Last resort: look for any array in the response
          const possibleArrays = Object.values(parsedContent).filter(val => Array.isArray(val)) as any[][];
          if (possibleArrays.length > 0) {
            // Use the first array found
            subjectLines = possibleArrays[0];
            console.log('Using fallback array:', subjectLines);
          }
        }
        
        if (!subjectLines || subjectLines.length === 0) {
          throw new Error('No subject lines found in the response');
        }
        
        // Create an array of GeneratedSubject objects with more flexible property mapping
        const subjects: GeneratedSubject[] = subjectLines.map((item: any) => {
          // Try to find subject line text with multiple property names
          const text = item.subject || item.text || item.subject_line || item.subjectLine || item.line || '';
          
          // Try to find preview text with multiple property names
          const previewText = 
            item.previewText || 
            item.preview || 
            item.preview_text || 
            item.email_preview || 
            item.emailPreview || 
            'Preview text not generated';
          
          return {
            text,
            previewText,
            style: selectedStyle
          };
        });
        
        if (subjects.length === 0 || !subjects[0].text) {
          throw new Error('Failed to extract subject lines from response');
        }
        
        setGeneratedSubjects(subjects);
      } catch (parseError: unknown) {
        console.error('Error parsing OpenAI response:', parseError);
        console.error('Raw content that failed to parse:', content);
        throw new Error('Failed to parse OpenAI response: ' + (parseError instanceof Error ? parseError.message : String(parseError)));
      }
    } catch (err) {
      console.error('Error generating subject lines:', err);
      setError('Failed to generate subject lines. Please check your API key or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const openEmailComposer = async (index: number, subject: string) => {
    // If already open, just close it
    if (emailComposerOpen === index) {
      setEmailComposerOpen(null);
      return;
    }
    
    // Open the composer for this subject
    setEmailComposerOpen(index);
    
    // Show loading state
    setIsGeneratingEmail(true);
    setEmailGenerationError(null);
    
    // Set a placeholder value while generating
    setEmailBody('Generating your email content...');
    
    // Get the API key if not already loaded
    if (!OPENAI_API_KEY) {
      OPENAI_API_KEY = getOpenAIApiKey();
    }
    
    if (!OPENAI_API_KEY) {
      setEmailGenerationError('OpenAI API key is not configured. Please check your environment variables.');
      setIsGeneratingEmail(false);
      setEmailBody('');
      return;
    }
    
    try {
      const openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a world-class email copywriter. Your task is to craft a compelling, persuasive email body that perfectly matches the subject line provided. The email should feel personalized, engaging, and drive the reader to take action.

Key instructions:
- Create email content that naturally flows from the subject line
- Keep paragraphs short and scannable (2-3 sentences max)
- Include 1-2 clear calls-to-action
- Write in a conversational, professional tone
- Use persuasive language that matches the style of the subject line
- Don't use generic templates or placeholder text
- Ensure the content is highly specific to the topic
- Do not use placeholder URLs or fictional website domains`
          },
          {
            role: "user",
            content: `Subject line: "${subject}"
            
Original email description: "${description}"

Please create a compelling email body that perfectly matches this subject line and description. The email should be personalized, engaging, and ready to send.`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });
      
      const generatedContent = response.choices[0]?.message?.content;
      if (generatedContent) {
        setEmailBody(generatedContent.trim());
      } else {
        throw new Error('No response content from OpenAI');
      }
    } catch (err) {
      console.error('Error generating email content:', err);
      setEmailGenerationError('Failed to generate email content. Please try again later.');
      setEmailBody('');
    } finally {
      setIsGeneratingEmail(false);
    }
  };
  
  const createEmail = (subject: string) => {
    // Create a mailto link with the subject and body
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    // Open the default email client
    window.open(mailtoLink, '_blank');
  };

  // Copy email body to clipboard
  const copyEmailBody = () => {
    navigator.clipboard.writeText(emailBody)
      .then(() => {
        setCopied({ body: true });
        setTimeout(() => setCopied(null), 2000);
      })
      .catch(() => {
        setError('Failed to copy email body to clipboard');
      });
  };

  // Add current email to favorites
  const addToFavorites = (subject: string) => {
    const newFavorite: FavoriteEmail = {
      id: Date.now().toString(),
      subject,
      body: emailBody,
      date: new Date().toLocaleString()
    };
    
    setFavorites(prev => [newFavorite, ...prev]);
    setEmailComposerOpen(null);
  };
  
  // Remove a favorite email
  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };
  
  // Use a favorite email
  const useFavoriteEmail = (favorite: FavoriteEmail) => {
    setEmailBody(favorite.body);
    setEmailComposerOpen(null);
    // Show a notification or take any other action you want
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">AI Subject Line Generator</h2>
      
      {/* Toggle for favorites */}
      {favorites.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            {showFavorites ? 'Hide Favorite Emails' : 'Show Favorite Emails'} ({favorites.length})
          </button>
        </div>
      )}
      
      {/* Favorites Section */}
      {showFavorites && favorites.length > 0 && (
        <div className="mb-8 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Favorite Emails</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-80 overflow-y-auto">
            {favorites.map(favorite => (
              <div key={favorite.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{favorite.subject}</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => useFavoriteEmail(favorite)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      title="Use this email"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeFavorite(favorite.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      title="Remove from favorites"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Saved on {favorite.date}</p>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {favorite.body.slice(0, 150)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEmailComposer(index, subject.text)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex-shrink-0"
                      title="Create email"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => copyToClipboard(subject.text, index, 'subject')}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex-shrink-0"
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

                {/* Email Composer */}
                {emailComposerOpen === index && (
                  <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Compose Email</h4>
                      {!isGeneratingEmail && (
                        <button
                          onClick={copyEmailBody}
                          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                          title="Copy email body"
                        >
                          {copied?.body ? (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              Copy All
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    
                    {/* Loading indicator */}
                    {isGeneratingEmail && (
                      <div className="mb-3">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">Crafting your email...</p>
                      </div>
                    )}
                    
                    {/* Error message */}
                    {emailGenerationError && (
                      <div className="mb-3 p-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100 rounded-md text-sm">
                        {emailGenerationError}
                      </div>
                    )}
                    
                    <textarea
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 mb-3"
                      rows={8}
                      placeholder="AI is generating your email content..."
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      disabled={isGeneratingEmail}
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEmailComposerOpen(null)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        disabled={isGeneratingEmail}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => addToFavorites(subject.text)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                        disabled={isGeneratingEmail || !emailBody.trim()}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Add to Favorites
                      </button>
                    </div>
                  </div>
                )}
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