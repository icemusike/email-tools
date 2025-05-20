import React, { useState } from 'react';
import type { TriggeredKeyword } from '../data/tempKeywords';

interface AccordionItemProps {
  item: TriggeredKeyword;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ item, isOpen, onClick }) => {
  // Set color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'RED': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'ORANGE': return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
      case 'YELLOW': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'GREEN': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  // Get source icon and color
  const getSourceInfo = (source: 'subject' | 'body' | 'both') => {
    let text = 'Found in: ';
    let icon = null;

    switch (source) {
      case 'subject':
        text += 'Subject';
        icon = (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
        break;
      case 'body':
        text += 'Body';
        icon = (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
        break;
      case 'both':
        text += 'Subject & Body';
        icon = (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
        break;
    }

    return (
      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
        {icon}
        {text}
      </div>
    );
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-md mb-2">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-150"
      >
        <div className="flex items-center space-x-2">
          <span className={`inline-block px-2 py-1 text-xs rounded ${getCategoryColor(item.category)}`}>
            {item.category}
          </span>
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {Array.isArray(item.term) ? item.term.join(', ') : item.term}
          </span>
        </div>
        <div className="flex items-center">
          <div className="mr-3 text-sm">
            <span className="font-semibold">{item.occurrences}×</span> 
            <span className="ml-1 text-gray-500 dark:text-gray-400">occur.</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-2">
            {getSourceInfo(item.source)}
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Impact:</span> +{item.weight} points per occurrence
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Suggestion</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{item.fix}</p>
          </div>
        </div>
      )}
    </div>
  );
};

interface AccordionProps {
  items: TriggeredKeyword[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!items || items.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">No trigger words found yet. Start typing!</p>;
  }

  // Sort items by category severity (RED, ORANGE, YELLOW, GREEN)
  const sortedItems = [...items].sort((a, b) => {
    const categoryOrder: Record<string, number> = { 'RED': 0, 'ORANGE': 1, 'YELLOW': 2, 'GREEN': 3 };
    return (categoryOrder[a.category] || 999) - (categoryOrder[b.category] || 999);
  });

  return (
    <div className="space-y-2">
      {sortedItems.map((item, index) => (
        <AccordionItem
          key={`${Array.isArray(item.term) ? item.term.join('-') : item.term}-${index}`}
          item={item}
          isOpen={openIndex === index}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};

export default Accordion; 