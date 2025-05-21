/**
 * Simple client-side navigation utility to handle navigation between tools
 * without refreshing the page.
 */

/**
 * Navigate to a new path without a full page reload
 * 
 * @param path The new path to navigate to
 */
export const navigate = (path: string): void => {
  // If we're using hash-based routing (for static file hosting compatibility)
  // Only update the hash portion
  if (window.location.hostname === 'localhost' || path === '/') {
    // In development or for root path, use regular pushState
    window.history.pushState({}, '', path);
  } else {
    // In production, use hash-based routing for better static file hosting compatibility
    const hashPath = path.startsWith('/') ? path.substring(1) : path;
    window.location.hash = hashPath;
    return; // hash change will trigger its own event
  }
  
  // Dispatch a popstate event to trigger route changes
  const navEvent = new PopStateEvent('popstate');
  window.dispatchEvent(navEvent);
};

/**
 * Get the current path from the URL
 * 
 * @returns The current path
 */
export const getCurrentPath = (): string => {
  // If using hash-based routing and a hash exists, use that
  if (window.location.hash && window.location.hash.startsWith('#')) {
    return '/' + window.location.hash.substring(1);
  }
  
  // Otherwise use the pathname
  return window.location.pathname || '/';
};

/**
 * Check if a path is active (matches the current path)
 * 
 * @param path The path to check
 * @returns True if the path is active
 */
export const isActive = (path: string): boolean => {
  const currentPath = getCurrentPath();
  return currentPath === path;
}; 