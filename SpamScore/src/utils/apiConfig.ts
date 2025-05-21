/**
 * Utility to safely handle API keys and environment variables
 * across different environments (local development and Vercel production)
 */

/**
 * Gets the OpenAI API key from the appropriate source based on the environment
 * - In Vercel production: Uses Vercel's environment variables
 * - In local development: Uses local .env file (VITE_OPENAI_API_KEY)
 * 
 * @returns The OpenAI API key or undefined if not found
 */
export const getOpenAIApiKey = (): string | undefined => {
  // Check for Vercel environment variables first (OPENAI_API_KEY)
  if (typeof process !== 'undefined' && process.env && process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }
  
  // Then check for VERCEL_ENV to confirm we're in Vercel environment
  if (typeof process !== 'undefined' && process.env && process.env.VERCEL_ENV) {
    console.error('Running in Vercel but OPENAI_API_KEY not found in environment variables');
    return undefined;
  }

  // For local development or client-side use
  if (import.meta.env && import.meta.env.VITE_OPENAI_API_KEY) {
    return import.meta.env.VITE_OPENAI_API_KEY;
  }

  // Fallback to window.__ENV__ if defined (some Vercel deploys might use this pattern)
  if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.OPENAI_API_KEY) {
    return window.__ENV__.OPENAI_API_KEY;
  }

  console.error('OpenAI API key not found in any environment configuration');
  return undefined;
};

// Add this to the global window interface
declare global {
  interface Window {
    __ENV__?: {
      OPENAI_API_KEY?: string;
      [key: string]: any;
    };
  }
} 