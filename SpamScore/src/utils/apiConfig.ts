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
  console.log('Environment detection starting...');
  
  // Detect if we're in a development environment
  const isDevelopment = 
    process.env.NODE_ENV === 'development' || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1';
  
  console.log(`Detected environment: ${isDevelopment ? 'Development' : 'Production'}`);
  
  // Check for meta tag first (our custom Vercel solution)
  const apiKeyMeta = document.querySelector('meta[name="openai-api-key"]') as HTMLMetaElement | null;
  if (apiKeyMeta && apiKeyMeta.content && apiKeyMeta.content !== '%VITE_OPENAI_API_KEY%') {
    console.log('Found API key in meta tag');
    return apiKeyMeta.content;
  }
  
  // Check window.__ENV__ (set in index.html)
  if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.OPENAI_API_KEY) {
    console.log('Found API key in window.__ENV__');
    return window.__ENV__.OPENAI_API_KEY;
  }
  
  // Check for Vercel environment variables
  if (typeof process !== 'undefined' && process.env && process.env.OPENAI_API_KEY) {
    console.log('Found API key in process.env.OPENAI_API_KEY');
    return process.env.OPENAI_API_KEY;
  }
  
  // Then check for VERCEL_ENV to confirm we're in Vercel environment
  if (typeof process !== 'undefined' && process.env && process.env.VERCEL_ENV) {
    console.warn('Running in Vercel but OPENAI_API_KEY not found in environment variables');
  }

  // For local development or client-side use with Vite
  if (import.meta.env && import.meta.env.VITE_OPENAI_API_KEY) {
    console.log('Found API key in import.meta.env.VITE_OPENAI_API_KEY');
    return import.meta.env.VITE_OPENAI_API_KEY;
  }

  // Last resort - see if it's directly available on window
  if (typeof window !== 'undefined' && (window as any).OPENAI_API_KEY) {
    console.log('Found API key directly on window object');
    return (window as any).OPENAI_API_KEY;
  }

  console.error('OpenAI API key not found in any environment configuration. Environment details:', {
    isDevelopment,
    hasMetaTag: Boolean(apiKeyMeta),
    hasWindowENV: Boolean(typeof window !== 'undefined' && window.__ENV__),
    hasProcessEnv: Boolean(typeof process !== 'undefined' && process.env),
    hasViteEnv: Boolean(import.meta.env),
    hostname: window.location.hostname
  });
  
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