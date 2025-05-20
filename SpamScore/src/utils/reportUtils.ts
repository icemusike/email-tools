import type { TriggeredKeyword } from "../data/tempKeywords";

export const generateMarkdownReport = (
  subject: string,
  body: string,
  totalScore: number,
  triggeredKeywords: TriggeredKeyword[],
): string => {
  // Calculate subject and body scores from triggered keywords
  let subjectScore = 0;
  let bodyScore = 0;
  
  const subjectKeywords = triggeredKeywords.filter(k => k.source === 'subject' || k.source === 'both');
  const bodyKeywords = triggeredKeywords.filter(k => k.source === 'body' || k.source === 'both');
  
  // Get risk level
  const getRiskLevel = (score: number): string => {
    if (score <= 30) return "Low Risk";
    if (score <= 60) return "Moderate Risk";
    if (score <= 80) return "High Risk";
    return "Critical Risk";
  };

  let report = `# Spam Score Report\n\n`;
  report += `## Score Breakdown\n\n`;
  report += `- **Total Score:** ${totalScore}/100 (${getRiskLevel(totalScore)})\n`;
  
  if (subjectKeywords.length > 0) {
    const highestSubjectWeight = Math.max(...subjectKeywords.map(k => k.weight));
    report += `- **Subject Line:** ${subjectKeywords.length} trigger words found (highest weight: ${highestSubjectWeight})\n`;
  } else {
    report += `- **Subject Line:** No trigger words found\n`;
  }
  
  if (bodyKeywords.length > 0) {
    const highestBodyWeight = Math.max(...bodyKeywords.map(k => k.weight));
    report += `- **Email Body:** ${bodyKeywords.length} trigger words found (highest weight: ${highestBodyWeight})\n`;
  } else {
    report += `- **Email Body:** No trigger words found\n`;
  }
  
  report += `\n## Email Content\n`;
  report += `### Subject\n\`\`\`\n${subject || "(empty)"}\n\`\`\`\n`;
  report += `### Body\n\`\`\`\n${body || "(empty)"}\n\`\`\`\n\n`;

  if (triggeredKeywords.length > 0) {
    // Group keywords by category
    const categories = ['RED', 'ORANGE', 'YELLOW', 'GREEN'];
    
    report += `## Triggered Keywords (${triggeredKeywords.length})\n\n`;
    
    categories.forEach(category => {
      const categoryKeywords = triggeredKeywords.filter(k => k.category === category);
      
      if (categoryKeywords.length > 0) {
        report += `### ${category} Zone (${categoryKeywords.length})\n\n`;
        
        categoryKeywords.forEach(keyword => {
          const termDisplay = Array.isArray(keyword.term) ? keyword.term.join(', ') : keyword.term;
          const location = keyword.source === 'both' ? 'Subject & Body' : 
                         keyword.source === 'subject' ? 'Subject' : 'Body';
          
          report += `#### "${termDisplay}"\n`;
          report += `- **Found in:** ${location}\n`;
          report += `- **Occurrences:** ${keyword.occurrences}\n`;
          report += `- **Weight:** ${keyword.weight} per occurrence\n`;
          report += `- **Impact:** +${keyword.weight * keyword.occurrences} points\n`;
          report += `- **Suggestion:** ${keyword.fix}\n\n`;
        });
      }
    });
  } else {
    report += `## Triggered Keywords\n\nNo specific spam trigger keywords found.\n`;
  }
  
  report += `\n## Risk Level Explanation\n\n`;
  report += `- **0-30:** Low Risk - Your email should pass most spam filters\n`;
  report += `- **31-60:** Moderate Risk - Consider revising highlighted terms\n`;
  report += `- **61-80:** High Risk - Your email may be flagged by spam filters\n`;
  report += `- **81-100:** Critical Risk - This email is very likely to be blocked\n`;
  
  return report;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!navigator.clipboard) {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed"; 
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      // console.error('Fallback: Oops, unable to copy', err);
      return false;
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // console.error('Async: Could not copy text: ', err);
    return false;
  }
};

export const downloadTextFile = (
    filename: string, 
    text: string, 
    mimeType = "text/markdown;charset=utf-8"
) => {
  const element = document.createElement("a");
  element.setAttribute("href", `data:${mimeType},${encodeURIComponent(text)}`);
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}; 