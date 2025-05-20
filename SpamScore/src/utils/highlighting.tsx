import React from 'react';
import type { ReactElement } from 'react';
import type { TriggeredKeyword } from "../data/keywords";

/**
 * Creates an array of segments (string or JSX element for highlighted parts)
 * from a text and a list of triggered keywords with their indices.
 */
export const createHighlightedSegments = (
  text: string,
  triggers: TriggeredKeyword[],
): (string | ReactElement)[] => {
  if (!text || triggers.length === 0) {
    return [text];
  }

  const allIndices: { start: number; end: number; term: string | string[] }[] = [];
  
  // Collect all valid indices
  triggers.forEach(trigger => {
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

  // Filter out overlapping matches
  const uniqueIndices: typeof allIndices = [];
  let currentRangeEnd = -1;
  
  allIndices.forEach(index => {
    if (index.start >= currentRangeEnd) {
      uniqueIndices.push(index);
      currentRangeEnd = index.end;
    }
  });

  // Build the result array with highlighted segments
  const result: (string | ReactElement)[] = [];
  let lastProcessedEnd = 0;

  uniqueIndices.forEach(({ start, end, term }, i) => {
    // Add text before the current highlight
    if (start > lastProcessedEnd) {
      result.push(text.substring(lastProcessedEnd, start));
    }

    // Add the highlighted part
    result.push(
      <span 
        key={`highlight-${start}-${i}`}
        className="bg-yellow-300 dark:bg-yellow-500 dark:text-gray-900 p-0.5 rounded-sm"
      >
        {text.substring(start, end)}
      </span>
    );
    
    lastProcessedEnd = end;
  });

  // Add any remaining text after the last highlight
  if (lastProcessedEnd < text.length) {
    result.push(text.substring(lastProcessedEnd));
  }

  return result;
} 