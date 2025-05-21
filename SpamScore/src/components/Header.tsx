import React, { useState } from 'react';
import { navigate, isActive } from '../utils/navigation';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Define a type for our supported routes
type AppRoute = '/' | '/subject-generator' | '/subject-line-tester' | '/email-template-builder' | '/deliverability-analyzer' | '/unsubscribe-link-generator';

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
    setIsMenuOpen(false); // Close menu after navigation on mobile
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <svg className="w-10 h-10 text-blue-600 dark:text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            Email<span className="text-gray-700 dark:text-gray-300 font-normal text-2xl">Tools</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-15.66l-.707.707M4.04 19.96l-.707.707M21 12h-1M4 12H3m15.66 8.66l-.707-.707M4.747 4.042l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <div className={`mt-4 md:mt-6 ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
        <nav className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
          <a 
            href="/" 
            onClick={handleNavigation('/')}
            className={`nav-link ${isActive('/') ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : ''}`}
          >
            Spam Score Checker
          </a>
          <a 
            href="/subject-generator" 
            onClick={handleNavigation('/subject-generator')}
            className={`nav-link ${isActive('/subject-generator') ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : ''}`}
          >
            Subject Generator
          </a>
          <a 
            href="/subject-line-tester" 
            onClick={handleNavigation('/subject-line-tester')}
            className={`nav-link ${isActive('/subject-line-tester') ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : ''}`}
          >
            Subject Line Tester
          </a>
          <a 
            href="/email-template-builder" 
            onClick={handleNavigation('/email-template-builder')}
            className={`nav-link ${isActive('/email-template-builder') ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : ''}`}
          >
            Template Builder
          </a>
          <a 
            href="/deliverability-analyzer" 
            onClick={handleNavigation('/deliverability-analyzer')}
            className={`nav-link ${isActive('/deliverability-analyzer') ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : ''}`}
          >
            Deliverability Analyzer
          </a>
          <a 
            href="/unsubscribe-link-generator" 
            onClick={handleNavigation('/unsubscribe-link-generator')}
            className={`nav-link ${isActive('/unsubscribe-link-generator') ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : ''}`}
          >
            Unsubscribe Link Generator
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header; 