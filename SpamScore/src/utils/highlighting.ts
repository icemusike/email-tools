import React from 'react';
import type { TriggeredKeyword } from '../data/keywords'; // Ensure type import

/**
 * Creates an array of segments (string or JSX element for highlighted parts)
 * from a text and a list of triggered keywords with their indices.
 * Handles case-insensitive matching for display and sorts indices to manage overlaps.
 */
export const createHighlightedSegments = (
  text: string, // Original casing text
  triggers: TriggeredKeyword[],
): (string | React.ReactElement)[] => {
  if (!text || triggers.length === 0) {
    return [text];
  }

  const allIndices: { start: number; end: number; term: string | string[] }[] = [];
  triggers.forEach(trigger => {
    // Ensure indices are valid and within text bounds for safety, though calculateScore should provide valid ones.
    trigger.indices.forEach(index => {
      if (index.start < text.length && index.end <= text.length && index.start < index.end) {
         allIndices.push({ ...index, term: trigger.term });
      }
    });
  });

  if (allIndices.length === 0) return [text];

  // Sort indices by start position, then by end position (longest match first if starts are same)
  allIndices.sort((a, b) => {
    if (a.start !== b.start) {
      return a.start - b.start;
    }
    return b.end - a.end; // Longest match first for identical start points
  });

  const result: (string | React.ReactElement)[] = [];
  let lastProcessedEnd = 0;

  const uniqueIndices: typeof allIndices = [];
  // Filter out overlapping/subsumed ranges to simplify.
  // The first match (longest if starts are same) at a position wins.
  let currentProcessedRangeEnd = -1;
  allIndices.forEach(index => {
    if (index.start >= currentProcessedRangeEnd) { // Only process if it doesn't start before the current range ends
        uniqueIndices.push(index);
        currentProcessedRangeEnd = index.end;
    } 
    // else: This index is either completely within a previously processed longer index 
    // or starts before the previous one ended. We skip it to avoid complex nested highlights for now.
    // Example: if we processed "free money" (0-10), we skip "free" (0-4).
  });
  
  uniqueIndices.forEach(({ start, end, term }, i) => {
    // Add text before the current highlight
    if (start > lastProcessedEnd) {
      result.push(text.substring(lastProcessedEnd, start));
    }

    // Add the highlighted part (using original casing from `text`)
    result.push(
      React.createElement(
        'span',
        { 
          key: `highlight-${start}-${i}`,
          className: "bg-yellow-300 dark:bg-yellow-500 dark:text-gray-900 p-0.5 rounded-sm"
        },
        text.substring(start, end)
      )
    );
    lastProcessedEnd = end;
  });

  // Add any remaining text after the last highlight
  if (lastProcessedEnd < text.length) {
    result.push(text.substring(lastProcessedEnd));
  }

  return result.length > 0 ? result : [text]; // Ensure it always returns an array, even if empty result somehow
}; 