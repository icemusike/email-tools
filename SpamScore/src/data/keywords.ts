export interface Keyword {
  term: string | string[];
  weight: number;
  fix: string;
  category: string; // 'RED', 'ORANGE', 'YELLOW', 'GREEN'
}

// RED ZONE ("almost certain spam") - ranks 1-25
const redZoneKeywords: Keyword[] = [
  { 
    term: ['viagra', 'cialis'], 
    weight: 25, 
    fix: 'Avoid mentioning prescription medications directly.', 
    category: 'RED' 
  },
  { 
    term: ['xxx', 'porn'], 
    weight: 25, 
    fix: 'Avoid adult content references in professional emails.', 
    category: 'RED' 
  },
  { 
    term: ['online casino', 'casino'], 
    weight: 25, 
    fix: 'Avoid gambling-related terms.', 
    category: 'RED' 
  },
  {
    term: ['urgent!!!', 'urgent!!', 'urgent!'],
    weight: 25,
    fix: 'Remove excessive exclamation marks and urgency language.',
    category: 'RED'
  },
  {
    term: ['buy now!!!', 'buy now!!', 'buy now!'],
    weight: 25,
    fix: 'Avoid pushy sales language with multiple exclamation marks.',
    category: 'RED'
  },
  {
    term: ['double your cash', 'double your money'],
    weight: 25,
    fix: 'Avoid unrealistic financial promises.',
    category: 'RED'
  },
  {
    term: ['miracle pill', 'miracle cure', 'miracle weight', 'weight-loss miracle'],
    weight: 25,
    fix: 'Avoid medical claims that sound too good to be true.',
    category: 'RED'
  },
  {
    term: ['exclusive offer', 'exclusive deal'],
    weight: 15,
    fix: 'Avoid promotional language that sounds too exclusive.',
    category: 'ORANGE'
  },
  {
    term: 'weight-loss',
    weight: 20,
    fix: 'Be careful with weight-loss terminology which often triggers spam filters.',
    category: 'RED'
  },
  {
    term: 'buy now',
    weight: 15,
    fix: 'Consider softer calls to action instead of direct commands to purchase.',
    category: 'ORANGE'
  },
  {
    term: 'urgent',
    weight: 15,
    fix: 'Replace urgent language with specific and helpful deadlines if applicable.',
    category: 'ORANGE'
  },
  {
    term: ['!!!', '!!'],
    weight: 20,
    fix: 'Avoid multiple exclamation marks which are strongly associated with spam.',
    category: 'RED'
  }
];

// ORANGE ZONE
const orangeZoneKeywords: Keyword[] = [
  {
    term: 'cash',
    weight: 15,
    fix: 'Use more specific financial terms instead of generic "cash" which can trigger spam filters.',
    category: 'ORANGE'
  },
  {
    term: 'exclusive',
    weight: 10,
    fix: 'Focus on specific value rather than vague exclusivity claims.',
    category: 'ORANGE'
  },
  {
    term: 'pill',
    weight: 15,
    fix: 'Avoid terms that sound like medication or supplements.',
    category: 'ORANGE'
  }
];

// YELLOW ZONE
const yellowZoneKeywords: Keyword[] = [
  {
    term: ['our', 'with our'],
    weight: 5,
    fix: 'Be specific about who "our" refers to for clarity and trust.',
    category: 'YELLOW'
  },
  {
    term: 'now',
    weight: 5,
    fix: 'Provide specific timelines instead of vague urgency.',
    category: 'YELLOW'
  }
];

export const keywords: Keyword[] = [
  ...redZoneKeywords,
  ...orangeZoneKeywords,
  ...yellowZoneKeywords
];

export interface TriggeredKeyword extends Keyword {
  occurrences: number;
  indices: { start: number; end: number }[];
  source: 'subject' | 'body' | 'both'; 
}

export interface ScoreResult {
  totalScore: number;
  subjectScore: number;
  bodyScore: number;
  triggeredKeywords: TriggeredKeyword[];
}

// Function to check for all caps text (spam indicator)
const containsAllCaps = (text: string): boolean => {
  // Check if there are words in all caps that are at least 4 characters long
  const words = text.split(/\s+/);
  return words.some(word => word.length >= 4 && word === word.toUpperCase() && /^[A-Z]+$/.test(word));
};

// Function to count exclamation marks
const countExclamationMarks = (text: string): number => {
  return (text.match(/!/g) || []).length;
};

export const calculateScore = (
  subject: string,
  body: string,
): ScoreResult => {
  let subjectScore = 0;
  let bodyScore = 0;
  const triggeredKeywords: TriggeredKeyword[] = [];
  
  const lowerSubject = subject.toLowerCase();
  const lowerBody = body.toLowerCase();

  // Check for all caps in subject (spam indicator)
  if (containsAllCaps(subject)) {
    subjectScore += 20;
    triggeredKeywords.push({
      term: 'ALL CAPS TEXT',
      weight: 20,
      fix: 'Avoid using ALL CAPS in your subject line as it\'s a strong spam indicator.',
      category: 'RED',
      occurrences: 1,
      indices: [{ start: 0, end: subject.length }],
      source: 'subject'
    });
  }

  // Check for all caps in body
  if (containsAllCaps(body)) {
    bodyScore += 15;
    triggeredKeywords.push({
      term: 'ALL CAPS TEXT',
      weight: 15,
      fix: 'Avoid using ALL CAPS in your email body as it\'s a spam indicator.',
      category: 'RED',
      occurrences: 1,
      indices: [{ start: 0, end: body.length }],
      source: 'body'
    });
  }

  // Check for multiple exclamation marks in subject
  const subjectExclamations = countExclamationMarks(subject);
  if (subjectExclamations >= 3) {
    subjectScore += 20;
    triggeredKeywords.push({
      term: 'MULTIPLE EXCLAMATION MARKS',
      weight: 20,
      fix: 'Remove multiple exclamation marks from your subject line.',
      category: 'RED',
      occurrences: 1,
      indices: [{ start: 0, end: subject.length }],
      source: 'subject'
    });
  } else if (subjectExclamations > 0) {
    subjectScore += 10;
    triggeredKeywords.push({
      term: 'EXCLAMATION MARK',
      weight: 10,
      fix: 'Consider removing exclamation marks from your subject line.',
      category: 'ORANGE',
      occurrences: subjectExclamations,
      indices: [{ start: 0, end: subject.length }],
      source: 'subject'
    });
  }

  keywords.forEach((keyword) => {
    const termsToSearch = Array.isArray(keyword.term) ? keyword.term : [keyword.term];
    let subjectOccurrences = 0;
    let bodyOccurrences = 0;
    const subjectIndices: { start: number; end: number }[] = [];
    const bodyIndices: { start: number; end: number }[] = [];

    termsToSearch.forEach(singleTerm => {
      const termToSearchLower = singleTerm.toLowerCase();
      
      // Search in subject
      let lastIndex = -1;
      while ((lastIndex = lowerSubject.indexOf(termToSearchLower, lastIndex + 1)) !== -1) {
        subjectOccurrences++;
        subjectIndices.push({ start: lastIndex, end: lastIndex + termToSearchLower.length });
      }
      
      // Search in body
      lastIndex = -1;
      while ((lastIndex = lowerBody.indexOf(termToSearchLower, lastIndex + 1)) !== -1) {
        bodyOccurrences++;
        bodyIndices.push({ start: lastIndex, end: lastIndex + termToSearchLower.length });
      }
    });

    const totalOccurrences = subjectOccurrences + bodyOccurrences;
    
    if (totalOccurrences > 0) {
      // Apply weights based on where the keyword was found
      const subjectWeight = keyword.weight * 1.5; // Subject has higher impact (50% more)
      const bodyWeight = keyword.weight;

      // Calculate scores
      subjectScore += subjectWeight * subjectOccurrences;
      bodyScore += bodyWeight * bodyOccurrences;

      // Determine where the keyword was found
      let source: 'subject' | 'body' | 'both' = 'body';
      if (subjectOccurrences > 0 && bodyOccurrences > 0) {
        source = 'both';
      } else if (subjectOccurrences > 0) {
        source = 'subject';
      }

      // Add to triggered keywords list
      triggeredKeywords.push({
        ...keyword,
        occurrences: totalOccurrences,
        indices: [...subjectIndices, ...bodyIndices],
        source
      });
    }
  });

  // Clamp scores between 0 and 100
  subjectScore = Math.max(0, Math.min(100, subjectScore));
  bodyScore = Math.max(0, Math.min(100, bodyScore));
  
  // Calculate total score
  let totalScore = 0;
  if (subject && body) {
    totalScore = (subjectScore * 0.4) + (bodyScore * 0.6);
  } else if (subject) {
    totalScore = subjectScore;
  } else if (body) {
    totalScore = bodyScore;
  }
  
  totalScore = Math.max(0, Math.min(100, totalScore));

  return { 
    totalScore: Math.round(totalScore), 
    subjectScore: Math.round(subjectScore), 
    bodyScore: Math.round(bodyScore), 
    triggeredKeywords 
  };
}; 