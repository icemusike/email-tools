import { useState, useEffect, useCallback, useRef } from 'react';
import type { TriggeredKeyword } from './data/tempKeywords';
import { calculateScore } from './data/tempKeywords';
import RadialGauge from './components/RadialGauge';
import Accordion from './components/Accordion';
import Header from './components/Header';
import SubjectGenerator from './components/SubjectGenerator';
import { createHighlightedSegments } from './utils/highlighting.tsx';
import { generateMarkdownReport, copyToClipboard, downloadTextFile } from './utils/reportUtils';
import { getCurrentPath } from './utils/navigation';

function App() {
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [totalScore, setTotalScore] = useState<number>(0);
  const [subjectScore, setSubjectScore] = useState<number>(0);
  const [bodyScore, setBodyScore] = useState<number>(0);
  const [triggered, setTriggered] = useState<TriggeredKeyword[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [copyStatus, setCopyStatus] = useState<string>('');
  const [currentPath, setCurrentPath] = useState<string>('/');
  const highlightedContentRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update current path based on window location
  useEffect(() => {
    const path = getCurrentPath();
    console.log('Initial path on mount:', path);
    setCurrentPath(path);

    // Add event listener for navigation
    const handleNavigation = () => {
      const newPath = getCurrentPath();
      console.log('Navigation event triggered, new path:', newPath);
      setCurrentPath(newPath);
    };

    window.addEventListener('popstate', handleNavigation);
    // Also listen for hashchange events for hash-based routing
    window.addEventListener('hashchange', handleNavigation);
    
    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('hashchange', handleNavigation);
    };
  }, []);

  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
    // Force immediate score update
    forceCompute();
  };

  const handleBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
    // Force immediate score update
    forceCompute();
  };

  // Force immediate score computation
  const forceCompute = () => {
    const result = calculateScore(subject, body);
    setTotalScore(result.totalScore);
    setSubjectScore(result.subjectScore);
    setBodyScore(result.bodyScore);
    setTriggered(result.triggeredKeywords);
  };

  // Handle paste for any input - let default paste behavior happen then trigger score calc
  const handleAnyPaste = (event: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Allow the default paste behavior to complete first
    setTimeout(() => {
      // Then force the computation
      const newSubject = event.currentTarget.id === 'subject' ? 
        (event.currentTarget as HTMLInputElement).value : subject;
      
      const newBody = event.currentTarget.id === 'body' ? 
        (event.currentTarget as HTMLTextAreaElement).value : body;
      
      // Update state if needed
      if (newSubject !== subject) {
        setSubject(newSubject);
      }
      
      if (newBody !== body) {
        setBody(newBody);
      }
      
      // Calculate score with the new values
      const result = calculateScore(newSubject, newBody);
      setTotalScore(result.totalScore);
      setSubjectScore(result.subjectScore);
      setBodyScore(result.bodyScore);
      setTriggered(result.triggeredKeywords);
    }, 0);
  };

  const syncScroll = () => {
    if (textareaRef.current && highlightedContentRef.current) {
      highlightedContentRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightedContentRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const computeScore = useCallback(() => {
    const result = calculateScore(subject, body);
    setTotalScore(result.totalScore);
    setSubjectScore(result.subjectScore);
    setBodyScore(result.bodyScore);
    setTriggered(result.triggeredKeywords);
  }, [subject, body]);

  useEffect(() => {
    computeScore();
  }, [subject, body, computeScore]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const highlightedBodyContent = createHighlightedSegments(body, triggered);

  const handleCopyReport = async () => {
    const report = generateMarkdownReport(subject, body, totalScore, triggered);
    const success = await copyToClipboard(report);
    setCopyStatus(success ? 'Copied successfully!' : 'Failed to copy.');
    setTimeout(() => setCopyStatus(''), 3000); // Clear status after 3 seconds
  };

  const handleDownloadReport = () => {
    const report = generateMarkdownReport(subject, body, totalScore, triggered);
    const date = new Date().toISOString().split('T')[0];
    downloadTextFile(`spam-score-report-${date}.md`, report);
  };

  const getScoreColor = (score: number) => {
    if (score <= 30) return 'text-green-500';
    if (score <= 60) return 'text-yellow-500';
    if (score <= 80) return 'text-amber-500';
    return 'text-red-500';
  };

  // Simple client-side routing to render different tools
  const renderCurrentTool = () => {
    // For now, we'll handle just two routes
    const currentFullPath = getCurrentPath();
    console.log('Current full path:', currentFullPath, 'State currentPath:', currentPath);
    
    if (currentFullPath === '/subject-generator') {
      console.log('Rendering SubjectGenerator component');
      return <SubjectGenerator />;
    }

    // Default to spam score checker
    console.log('Rendering default Spam Score component');
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="card">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject Line
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={handleSubjectChange}
                onPaste={handleAnyPaste}
                onInput={() => setTimeout(forceCompute, 0)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Enter email subject"
              />
              {subject && (
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Subject Score:</span>
                  <span className={`text-sm font-medium ${getScoreColor(subjectScore)}`}>{subjectScore}/100</span>
                </div>
              )}
            </div>
            
            <div className="card">
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Body Content
              </label>
              <div className="relative rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus-within:ring-blue-500 focus-within:border-blue-500 dark:bg-gray-800 min-h-[300px] max-h-[500px] font-mono text-sm">
                <div 
                  ref={highlightedContentRef}
                  className="absolute inset-0 p-4 whitespace-pre-wrap overflow-auto pointer-events-none" 
                  aria-hidden="true"
                >
                  {highlightedBodyContent}
                </div>
                <textarea
                  ref={textareaRef}
                  id="body"
                  value={body}
                  onChange={handleBodyChange}
                  onPaste={handleAnyPaste}
                  onInput={() => setTimeout(forceCompute, 0)}
                  onScroll={syncScroll}
                  className="absolute inset-0 w-full h-full p-4 border-transparent rounded-md focus:ring-0 focus:border-transparent bg-transparent text-transparent caret-gray-900 dark:caret-gray-100 resize-none font-mono text-sm overflow-auto"
                  placeholder="Enter email body content here..."
                  rows={12}
                />
              </div>
              <div className="mt-2 flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Keywords found in body content will be highlighted automatically.
                </p>
                {body && (
                  <span className={`text-sm font-medium ${getScoreColor(bodyScore)}`}>Body Score: {bodyScore}/100</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-6 text-center">Spam Risk Score</h2>
              <RadialGauge score={totalScore} />
              <div className="mt-4 w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Score:</span>
                  <span className={`text-sm font-semibold ${getScoreColor(totalScore)}`}>{totalScore}/100</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {totalScore <= 30 && "Low risk. Your email should pass most spam filters."}
                  {totalScore > 30 && totalScore <= 60 && "Moderate risk. Consider revising highlighted terms."}
                  {totalScore > 60 && totalScore <= 80 && "High risk. Your email may be flagged by spam filters."}
                  {totalScore > 80 && "Critical risk. This email is very likely to be blocked."}
                </p>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Actions</h2>
              <div className="space-y-3">
                <button 
                  onClick={handleCopyReport}
                  className="btn btn-primary w-full flex items-center justify-center"
                  disabled={!subject && !body}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Report
                </button>
                <button 
                  onClick={handleDownloadReport}
                  className="btn btn-success w-full flex items-center justify-center"
                  disabled={!subject && !body}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Report (MD)
                </button>
                {copyStatus && (
                  <div className={`mt-2 text-sm ${copyStatus.includes('Failed') ? 'text-red-500' : 'text-green-500'} bg-gray-100 dark:bg-gray-700 p-2 rounded-md text-center transition-opacity duration-300`}>
                    {copyStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Trigger Analysis</h2>
            <div>
              <span className="inline-block px-2 py-1 text-xs rounded mr-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">RED</span>
              <span className="inline-block px-2 py-1 text-xs rounded mr-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">ORANGE</span>
              <span className="inline-block px-2 py-1 text-xs rounded mr-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">YELLOW</span>
              <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">GREEN</span>
            </div>
          </div>
          {triggered.length > 0 ? (
            <Accordion items={triggered} />
          ) : (
            <div className="py-4 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-md">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No trigger words found yet. Start typing to analyze your content!</p>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="mx-auto px-4 py-8 max-w-6xl">
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        
        {renderCurrentTool()}
        
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Email Tools © 2025 | Tools for effective email marketing</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
