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
  // Update URL without reloading the page
  window.history.pushState({}, '', path);
  
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
  return currentPath === path || window.location.hash === `#${path.replace('/', '')}`;
}; 