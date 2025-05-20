export interface Keyword {
  term: string | string[]; // string or array of strings for multi-word phrases
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
    term: ['bet now', 'big win', 'jackpot'], 
    weight: 25, 
    fix: 'Avoid gambling-related terminology and high-pressure language.', 
    category: 'RED' 
  },
  { 
    term: ['get rich quick', 'make money fast'], 
    weight: 25, 
    fix: 'Replace with more realistic and specific value propositions.', 
    category: 'RED' 
  },
  { 
    term: ['free money', 'earn cash'], 
    weight: 25, 
    fix: 'Focus on specific, realistic benefits rather than unrealistic promises.', 
    category: 'RED' 
  },
  { 
    term: 'double your money', 
    weight: 25, 
    fix: 'Avoid unrealistic financial promises. Focus on specific, honest benefits.', 
    category: 'RED' 
  },
  { 
    term: ['weight loss', 'miracle cure', 'no prescription needed'], 
    weight: 25, 
    fix: 'Avoid medical claims that sound too good to be true.', 
    category: 'RED' 
  },
  { 
    term: ['100 % free', 'risk-free'], 
    weight: 25, 
    fix: 'Use more moderate language like "no additional cost" or explain specific terms.', 
    category: 'RED' 
  },
  { 
    term: ['winner', 'lottery', 'prize inside'], 
    weight: 25, 
    fix: 'Avoid sweepstakes/lottery language unless you're running a legitimate promotion.', 
    category: 'RED' 
  },
  { 
    term: ['act now!!!', 'urgent'], 
    weight: 25, 
    fix: 'Avoid excessive urgency. Use softer calls to action with clear deadlines if relevant.', 
    category: 'RED' 
  },
  { 
    term: ['instant earnings', 'instant winnings'], 
    weight: 25, 
    fix: 'Focus on realistic benefits and timeframes instead of "instant" gratification.', 
    category: 'RED' 
  },
  { 
    term: ['guaranteed deposit', '100 % guaranteed'], 
    weight: 25, 
    fix: 'Avoid absolute guarantees. Use more nuanced language about your confidence.', 
    category: 'RED' 
  },
  { 
    term: 'cash-out now', 
    weight: 25, 
    fix: 'Avoid gambling or investment language that implies immediate financial gain.', 
    category: 'RED' 
  },
  { 
    term: ['restricted access', 'exclusive access'], 
    weight: 25, 
    fix: 'Instead of focusing on exclusivity, focus on the specific value or relevance.', 
    category: 'RED' 
  },
  { 
    term: 'hot singles', 
    weight: 25, 
    fix: 'Avoid dating or adult content language in professional emails.', 
    category: 'RED' 
  },
  { 
    term: 'online pharmacy', 
    weight: 25, 
    fix: 'Avoid references to online pharmacies or medication sales.', 
    category: 'RED' 
  },
  { 
    term: 'adult content', 
    weight: 25, 
    fix: 'Avoid references to adult-oriented material in professional emails.', 
    category: 'RED' 
  },
  { 
    term: 'lose weight fast', 
    weight: 25, 
    fix: 'Avoid claims about rapid weight loss. Focus on health benefits if relevant.', 
    category: 'RED' 
  },
  { 
    term: 'miracle pill', 
    weight: 25, 
    fix: 'Avoid terms that suggest miraculous or unrealistic medical benefits.', 
    category: 'RED' 
  },
  { 
    term: 'risk-free bet', 
    weight: 25, 
    fix: 'Avoid gambling language. Focus on actual value propositions.', 
    category: 'RED' 
  },
  { 
    term: 'fast Viagra delivery', 
    weight: 25, 
    fix: 'Remove references to prescription medication delivery.', 
    category: 'RED' 
  },
  { 
    term: 'full refund—no questions', 
    weight: 25, 
    fix: 'Detail your actual refund policy rather than using vague no-questions language.', 
    category: 'RED' 
  },
  { 
    term: 'investment secret', 
    weight: 25, 
    fix: 'Avoid suggesting you have secret financial information. Focus on transparency.', 
    category: 'RED' 
  },
  { 
    term: 'work-from-home scheme', 
    weight: 25, 
    fix: 'Avoid the term "scheme" and focus on legitimate remote work opportunities if relevant.', 
    category: 'RED' 
  }
];

// ORANGE ZONE (high risk) - ranks 26-70
const orangeZoneKeywords: Keyword[] = [
  { 
    term: 'buy now', 
    weight: 15, 
    fix: 'Consider using "Learn more" or "See options" instead of direct purchase commands.', 
    category: 'ORANGE' 
  },
  { 
    term: ['limited time', 'limited offer'], 
    weight: 15, 
    fix: 'If you must create urgency, be specific about deadlines instead of using vague language.', 
    category: 'ORANGE' 
  },
  { 
    term: ['order now', 'order today'], 
    weight: 15, 
    fix: 'Try "Explore options" or "See details" for a softer approach.', 
    category: 'ORANGE' 
  },
  { 
    term: ['free trial', 'free gift', 'free consultation'], 
    weight: 15, 
    fix: 'Be specific about what's free and any conditions that apply.', 
    category: 'ORANGE' 
  },
  { 
    term: ['credit-card offers', 'bad credit OK'], 
    weight: 15, 
    fix: 'Avoid direct references to credit status or credit offers.', 
    category: 'ORANGE' 
  },
  { 
    term: ['debt consolidation', 'refinance today'], 
    weight: 15, 
    fix: 'If offering financial services, use more specific, less promotional language.', 
    category: 'ORANGE' 
  },
  { 
    term: 'money-back guarantee', 
    weight: 15, 
    fix: 'Be specific about return policies rather than using broad guarantee language.', 
    category: 'ORANGE' 
  },
  { 
    term: ['instant savings', 'instant income'], 
    weight: 15, 
    fix: 'Avoid "instant" claims. Focus on realistic benefits and timeframes.', 
    category: 'ORANGE' 
  },
  { 
    term: ['earn $$', 'extra income'], 
    weight: 15, 
    fix: 'Use specific numbers and realistic timeframes rather than vague money symbols.', 
    category: 'ORANGE' 
  },
  { 
    term: ['no obligation', 'no risk'], 
    weight: 15, 
    fix: 'Explain specific terms rather than making sweeping "no risk" statements.', 
    category: 'ORANGE' 
  },
  { 
    term: 'access now', 
    weight: 15, 
    fix: 'Use "View details" or "Learn more" rather than urgent access language.', 
    category: 'ORANGE' 
  },
  { 
    term: ['best price', 'best offer', 'best deal'], 
    weight: 15, 
    fix: 'Specify the actual value rather than using superlatives like "best."', 
    category: 'ORANGE' 
  },
  { 
    term: 'discount — % off', 
    weight: 15, 
    fix: 'Be specific about discounts, and focus on the value not just the % off.', 
    category: 'ORANGE' 
  },
  { 
    term: ['bargain', 'cheap'], 
    weight: 15, 
    fix: 'Focus on value rather than low cost, which can appear spammy.', 
    category: 'ORANGE' 
  },
  { 
    term: ['save big', 'save $$$'], 
    weight: 15, 
    fix: 'Use specific numbers instead of dollar signs and vague claims.', 
    category: 'ORANGE' 
  },
  { 
    term: ['price protection', 'lowest price'], 
    weight: 15, 
    fix: 'Clearly explain your policies rather than making broad claims.', 
    category: 'ORANGE' 
  },
  { 
    term: ['special offer', 'exclusive deal'], 
    weight: 15, 
    fix: 'Focus on specific benefits rather than vague "special" language.', 
    category: 'ORANGE' 
  },
  { 
    term: ['amazing deal', 'unbelievable'], 
    weight: 15, 
    fix: 'Avoid hyperbole. Focus on specific, believable benefits.', 
    category: 'ORANGE' 
  },
  { 
    term: ['click below', 'click here', 'click now'], 
    weight: 15, 
    fix: 'Use descriptive button text like "View Details" instead of generic clicks.', 
    category: 'ORANGE' 
  },
  { 
    term: 'congratulations!', 
    weight: 15, 
    fix: 'Avoid fake congratulations. Only congratulate for genuine accomplishments.', 
    category: 'ORANGE' 
  },
  { 
    term: ['last chance', 'final call'], 
    weight: 15, 
    fix: 'Specify deadlines instead of using urgent pressure tactics.', 
    category: 'ORANGE' 
  },
  { 
    term: ['trial', 'trial ends'], 
    weight: 15, 
    fix: 'Be specific about trial periods and conditions.', 
    category: 'ORANGE' 
  },
  { 
    term: 'while supplies last', 
    weight: 15, 
    fix: 'If truly limited, be specific about quantities instead of using this cliché.', 
    category: 'ORANGE' 
  },
  { 
    term: ['call now', 'toll-free'], 
    weight: 15, 
    fix: 'Provide contact information without pushy language like "call now."', 
    category: 'ORANGE' 
  },
  { 
    term: ['cancel any time', 'cancel now'], 
    weight: 15, 
    fix: 'Be transparent about subscription terms without emphasizing cancellation.', 
    category: 'ORANGE' 
  },
  { 
    term: 'full refund', 
    weight: 15, 
    fix: 'Explain your specific refund policy instead of using broad refund claims.', 
    category: 'ORANGE' 
  },
  { 
    term: ['only $X', 'just $'], 
    weight: 15, 
    fix: 'State prices clearly without minimizing language like "only" or "just."', 
    category: 'ORANGE' 
  },
  { 
    term: ['earn per week', 'earn per month'], 
    weight: 15, 
    fix: 'Be very specific about income potential and include realistic expectations.', 
    category: 'ORANGE' 
  },
  { 
    term: 'join millions', 
    weight: 15, 
    fix: 'Use precise numbers if possible, or focus on benefits rather than popularity.', 
    category: 'ORANGE' 
  },
  { 
    term: 'lowest price ever', 
    weight: 15, 
    fix: 'Be specific about pricing without using superlatives.', 
    category: 'ORANGE' 
  },
  { 
    term: 'guarantee approved', 
    weight: 15, 
    fix: 'Avoid guaranteeing approvals. Explain the actual process.', 
    category: 'ORANGE' 
  },
  { 
    term: ['big bucks', 'easy money'], 
    weight: 15, 
    fix: 'Avoid informal money references and unrealistic financial promises.', 
    category: 'ORANGE' 
  },
  { 
    term: 'double your cash', 
    weight: 15, 
    fix: 'Avoid unrealistic financial promises. Focus on specific, realistic benefits.', 
    category: 'ORANGE' 
  },
  { 
    term: 'investment advice', 
    weight: 15, 
    fix: 'Include proper disclaimers if offering financial guidance.', 
    category: 'ORANGE' 
  },
  { 
    term: ['free quote', 'free access'], 
    weight: 15, 
    fix: 'Be specific about what's free and any conditions that apply.', 
    category: 'ORANGE' 
  },
  { 
    term: ['50 % off', '75 % off'], 
    weight: 15, 
    fix: 'If offering discounts, focus on value rather than just percentage off.', 
    category: 'ORANGE' 
  },
  { 
    term: 'deal ending soon', 
    weight: 15, 
    fix: 'Provide a specific end date rather than vague urgency.', 
    category: 'ORANGE' 
  },
  { 
    term: 'priority shipping', 
    weight: 15, 
    fix: 'Be specific about shipping speeds and costs.', 
    category: 'ORANGE' 
  },
  { 
    term: 'pre-approved', 
    weight: 15, 
    fix: 'Avoid suggesting automatic approval for financial offers.', 
    category: 'ORANGE' 
  },
  { 
    term: 'extra cash', 
    weight: 15, 
    fix: 'Use specific amounts rather than vague cash promises.', 
    category: 'ORANGE' 
  },
  { 
    term: 'free upgrade', 
    weight: 15, 
    fix: 'Be specific about what's included in any upgrade.', 
    category: 'ORANGE' 
  },
  { 
    term: 'instant access', 
    weight: 15, 
    fix: 'Focus on the value of access rather than its immediacy.', 
    category: 'ORANGE' 
  },
  { 
    term: 'lose fat', 
    weight: 15, 
    fix: 'Avoid making claims about weight loss. Focus on health benefits if relevant.', 
    category: 'ORANGE' 
  },
  { 
    term: 'payday', 
    weight: 15, 
    fix: 'Avoid references to payday loans or quick cash services.', 
    category: 'ORANGE' 
  },
  { 
    term: 'secret formula', 
    weight: 15, 
    fix: 'Focus on transparency about your product's benefits rather than secrecy.', 
    category: 'ORANGE' 
  }
];

// YELLOW ZONE (moderate) - ranks 71-110
const yellowZoneKeywords: Keyword[] = [
  { 
    term: ['sale', 'flash sale'], 
    weight: 10, 
    fix: 'Specify the exact value and express what's on sale specifically.', 
    category: 'YELLOW' 
  },
  { 
    term: ['coupon code', 'discount code'], 
    weight: 10, 
    fix: 'Provide context for the discount rather than just focusing on the code.', 
    category: 'YELLOW' 
  },
  { 
    term: 'offer expires', 
    weight: 10, 
    fix: 'Include a specific date instead of vague expiration language.', 
    category: 'YELLOW' 
  },
  { 
    term: ['act fast', 'don\'t delay'], 
    weight: 10, 
    fix: 'Remove urgency language and focus on value instead.', 
    category: 'YELLOW' 
  },
  { 
    term: 'save up to X %', 
    weight: 10, 
    fix: 'Be specific about savings amounts rather than using the vague "up to."', 
    category: 'YELLOW' 
  },
  { 
    term: ['hot deal', 'hot exclusive'], 
    weight: 10, 
    fix: 'Focus on specific value rather than promotional language.', 
    category: 'YELLOW' 
  },
  { 
    term: ['bonus', 'reward', 'gift card'], 
    weight: 10, 
    fix: 'Be specific about bonus values or reward conditions.', 
    category: 'YELLOW' 
  },
  { 
    term: 'referral bonus', 
    weight: 10, 
    fix: 'Explain referral programs clearly with specific details on incentives.', 
    category: 'YELLOW' 
  },
  { 
    term: 'important update', 
    weight: 10, 
    fix: 'Specify exactly what the update is about rather than using vague importance.', 
    category: 'YELLOW' 
  },
  { 
    term: ['account update', 'password reset'], 
    weight: 10, 
    fix: 'Use your company name in subject lines about accounts to reduce phishing concerns.', 
    category: 'YELLOW' 
  },
  { 
    term: ['secure payment', 'verify identity'], 
    weight: 10, 
    fix: 'Avoid language commonly used in phishing. Be clear who you are.', 
    category: 'YELLOW' 
  },
  { 
    term: ['phishing alert', 'data breach'], 
    weight: 10, 
    fix: 'These security terms often trigger filters. Use company name and be specific.', 
    category: 'YELLOW' 
  },
  { 
    term: 'antivirus alert', 
    weight: 10, 
    fix: 'Avoid language that sounds like security software warnings.', 
    category: 'YELLOW' 
  },
  { 
    term: ['apply now', 'application inside'], 
    weight: 10, 
    fix: 'Focus on benefits of applying rather than pushing the application process.', 
    category: 'YELLOW' 
  },
  { 
    term: 'schedule your call', 
    weight: 10, 
    fix: 'Use more specific language about the purpose of the call.', 
    category: 'YELLOW' 
  },
  { 
    term: ['free demo', 'free report', 'free preview'], 
    weight: 10, 
    fix: 'Emphasize value of what's offered, not just that it's free.', 
    category: 'YELLOW' 
  },
  { 
    term: 'limited stock', 
    weight: 10, 
    fix: 'If truly limited, specify quantities instead of this common phrase.', 
    category: 'YELLOW' 
  },
  { 
    term: 'click to unsubscribe', 
    weight: 10, 
    fix: 'Keep unsubscribe information in the footer, not the main content.', 
    category: 'YELLOW' 
  },
  { 
    term: ['now only', 'today only'], 
    weight: 10, 
    fix: 'Instead of creating false urgency, explain why the timing matters.', 
    category: 'YELLOW' 
  },
  { 
    term: 'friends and family offer', 
    weight: 10, 
    fix: 'Explain specific terms of the offer rather than using this common phrase.', 
    category: 'YELLOW' 
  },
  { 
    term: 'official notice', 
    weight: 10, 
    fix: 'Avoid sounding like government notifications. Be clear who you are.', 
    category: 'YELLOW' 
  },
  { 
    term: ['urgent reply', 'action required'], 
    weight: 10, 
    fix: 'Explain why something needs attention instead of generic urgency.', 
    category: 'YELLOW' 
  },
  { 
    term: 'amazing stuff', 
    weight: 10, 
    fix: 'Use concrete descriptions instead of vague promotional language.', 
    category: 'YELLOW' 
  },
  { 
    term: 'reminder', 
    weight: 10, 
    fix: 'Include specifics about what you're reminding about in the subject.', 
    category: 'YELLOW' 
  },
  { 
    term: 'exclusive invitation', 
    weight: 10, 
    fix: 'Focus on the event's value, not its exclusivity.', 
    category: 'YELLOW' 
  },
  { 
    term: 'new customers only', 
    weight: 10, 
    fix: 'Clearly explain offer limitations without this common promotional phrase.', 
    category: 'YELLOW' 
  },
  { 
    term: 'supplies running out', 
    weight: 10, 
    fix: 'If truly limited, be specific about quantities instead of vague scarcity.', 
    category: 'YELLOW' 
  },
  { 
    term: ['unlock', 'upgrade'], 
    weight: 10, 
    fix: 'Focus on specific benefits rather than vague "unlocking" language.', 
    category: 'YELLOW' 
  },
  { 
    term: 'satisfaction guaranteed', 
    weight: 10, 
    fix: 'Explain your specific satisfaction policy instead of using this cliché.', 
    category: 'YELLOW' 
  },
  { 
    term: 'one-time payment', 
    weight: 10, 
    fix: 'Be transparent about all costs and payment structures.', 
    category: 'YELLOW' 
  },
  { 
    term: 'referral inside', 
    weight: 10, 
    fix: 'Be more specific about your referral program in the subject line.', 
    category: 'YELLOW' 
  },
  { 
    term: 'free support', 
    weight: 10, 
    fix: 'Emphasize the quality of support rather than just that it's included.', 
    category: 'YELLOW' 
  },
  { 
    term: 'sign up free', 
    weight: 10, 
    fix: 'Focus on benefits of signing up rather than just that it's free.', 
    category: 'YELLOW' 
  },
  { 
    term: 'meet singles', 
    weight: 10, 
    fix: 'Avoid dating-related language in professional emails.', 
    category: 'YELLOW' 
  },
  { 
    term: 'open immediately', 
    weight: 10, 
    fix: 'Explain why the content is time-sensitive instead of using this phrase.', 
    category: 'YELLOW' 
  },
  { 
    term: 'approved', 
    weight: 10, 
    fix: 'Be specific about what was approved rather than using this trigger word.', 
    category: 'YELLOW' 
  },
  { 
    term: 'attention', 
    weight: 10, 
    fix: 'Be direct about your message instead of using attention-grabbing language.', 
    category: 'YELLOW' 
  },
  { 
    term: 'response required', 
    weight: 10, 
    fix: 'Explain why a response is needed instead of demanding one.', 
    category: 'YELLOW' 
  },
  { 
    term: 'limited-edition', 
    weight: 10, 
    fix: 'Focus on the unique value, not just the limited availability.', 
    category: 'YELLOW' 
  },
  { 
    term: 'win a prize', 
    weight: 10, 
    fix: 'If running a legitimate contest, be specific about the prize and odds.', 
    category: 'YELLOW' 
  }
];

// GREEN ZONE (lower—but still promotional) - ranks 111-150
const greenZoneKeywords: Keyword[] = [
  { 
    term: 'newsletter', 
    weight: 5, 
    fix: 'Include specific content topics rather than just labeling as a newsletter.', 
    category: 'GREEN' 
  },
  { 
    term: ['update', 'product update'], 
    weight: 5, 
    fix: 'Be specific about what's being updated rather than using generic terms.', 
    category: 'GREEN' 
  },
  { 
    term: 'announcement', 
    weight: 5, 
    fix: 'Specify what you're announcing rather than using the generic term.', 
    category: 'GREEN' 
  },
  { 
    term: ['invitation', 'invite'], 
    weight: 5, 
    fix: 'Include details about what you're inviting to in your subject line.', 
    category: 'GREEN' 
  },
  { 
    term: ['download', 'download now'], 
    weight: 5, 
    fix: 'Focus on the value of what's being downloaded rather than the action.', 
    category: 'GREEN' 
  },
  { 
    term: 'learn more', 
    weight: 5, 
    fix: 'Specify what can be learned rather than using this generic phrase.', 
    category: 'GREEN' 
  },
  { 
    term: 'view online', 
    weight: 5, 
    fix: 'This is generally fine but include specific content information.', 
    category: 'GREEN' 
  },
  { 
    term: 'details inside', 
    weight: 5, 
    fix: 'Include some of those details in the subject line instead.', 
    category: 'GREEN' 
  },
  { 
    term: 'information you requested', 
    weight: 5, 
    fix: 'Specify what information is being provided.', 
    category: 'GREEN' 
  },
  { 
    term: 'contact us', 
    weight: 5, 
    fix: 'Include a reason to contact you, not just the call to action.', 
    category: 'GREEN' 
  },
  { 
    term: 'follow-up', 
    weight: 5, 
    fix: 'Mention the specific topic you're following up about.', 
    category: 'GREEN' 
  },
  { 
    term: ['thank you', 'thanks'], 
    weight: 5, 
    fix: 'Include what you're thanking for, rather than just saying thanks.', 
    category: 'GREEN' 
  },
  { 
    term: ['confirm', 'confirmation'], 
    weight: 5, 
    fix: 'Specify what's being confirmed for clarity.', 
    category: 'GREEN' 
  },
  { 
    term: 'free shipping', 
    weight: 5, 
    fix: 'Include minimum purchase requirements if applicable.', 
    category: 'GREEN' 
  },
  { 
    term: ['gift', 'gift inside'], 
    weight: 5, 
    fix: 'Be specific about any gift offers and required purchases.', 
    category: 'GREEN' 
  },
  { 
    term: 'new features', 
    weight: 5, 
    fix: 'Highlight specific features rather than using the generic phrase.', 
    category: 'GREEN' 
  },
  { 
    term: 'check it out', 
    weight: 5, 
    fix: 'Specify what should be checked out.', 
    category: 'GREEN' 
  },
  { 
    term: 'explore', 
    weight: 5, 
    fix: 'Include what can be explored for more specificity.', 
    category: 'GREEN' 
  },
  { 
    term: 'discover', 
    weight: 5, 
    fix: 'Mention what can be discovered rather than using this vague term alone.', 
    category: 'GREEN' 
  },
  { 
    term: 'see how', 
    weight: 5, 
    fix: 'Complete the phrase with what they'll see how to do.', 
    category: 'GREEN' 
  },
  { 
    term: 'latest offers', 
    weight: 5, 
    fix: 'Mention specific offers rather than using this general phrase.', 
    category: 'GREEN' 
  },
  { 
    term: 'read online', 
    weight: 5, 
    fix: 'Specify what can be read for more clarity.', 
    category: 'GREEN' 
  },
  { 
    term: 'join us', 
    weight: 5, 
    fix: 'Explain what they're joining and why it matters.', 
    category: 'GREEN' 
  },
  { 
    term: 'connect', 
    weight: 5, 
    fix: 'Explain the value of connecting rather than just the action.', 
    category: 'GREEN' 
  },
  { 
    term: 'see more', 
    weight: 5, 
    fix: 'Specify what they'll see more of.', 
    category: 'GREEN' 
  },
  { 
    term: 'order status', 
    weight: 5, 
    fix: 'This is generally fine for transactional emails.', 
    category: 'GREEN' 
  },
  { 
    term: 'upgrade now', 
    weight: 5, 
    fix: 'Focus on the specific benefits of upgrading, not just the action.', 
    category: 'GREEN' 
  },
  { 
    term: 'renew', 
    weight: 5, 
    fix: 'Include specifics about what's being renewed and why it matters.', 
    category: 'GREEN' 
  },
  { 
    term: 'watch now', 
    weight: 5, 
    fix: 'Specify what can be watched rather than just the call to action.', 
    category: 'GREEN' 
  },
  { 
    term: 'RSVP', 
    weight: 5, 
    fix: 'Include event details along with the RSVP request.', 
    category: 'GREEN' 
  },
  { 
    term: 'webinar invite', 
    weight: 5, 
    fix: 'Include the specific webinar topic and value.', 
    category: 'GREEN' 
  },
  { 
    term: 'ebook download', 
    weight: 5, 
    fix: 'Mention the ebook title or topic, not just that it's downloadable.', 
    category: 'GREEN' 
  },
  { 
    term: 'case study', 
    weight: 5, 
    fix: 'Include the specific case study topic or results.', 
    category: 'GREEN' 
  },
  { 
    term: 'free resources', 
    weight: 5, 
    fix: 'Specify which resources are being offered.', 
    category: 'GREEN' 
  },
  { 
    term: 'how-to', 
    weight: 5, 
    fix: 'Complete the phrase with what they'll learn how to do.', 
    category: 'GREEN' 
  },
  { 
    term: 'quick tip', 
    weight: 5, 
    fix: 'Include the specific tip or topic area.', 
    category: 'GREEN' 
  },
  { 
    term: ['survey', 'survey inside'], 
    weight: 5, 
    fix: 'Explain the purpose and length of the survey.', 
    category: 'GREEN' 
  },
  { 
    term: 'feedback request', 
    weight: 5, 
    fix: 'Specify what you want feedback on.', 
    category: 'GREEN' 
  },
  { 
    term: 'referral', 
    weight: 5, 
    fix: 'Explain your referral program benefits specifically.', 
    category: 'GREEN' 
  },
  { 
    term: 'share with a friend', 
    weight: 5, 
    fix: 'Focus on the value of what's being shared.', 
    category: 'GREEN' 
  }
];

// Combine all keyword groups
export const keywords: Keyword[] = [
  ...redZoneKeywords,
  ...orangeZoneKeywords,
  ...yellowZoneKeywords,
  ...greenZoneKeywords
];

export interface TriggeredKeyword extends Keyword {
  occurrences: number;
  indices: { start: number; end: number }[];
  source: 'subject' | 'body' | 'both'; // Where the keyword was found
}

export interface ScoreResult {
  totalScore: number;
  subjectScore: number;
  bodyScore: number;
  triggeredKeywords: TriggeredKeyword[];
}

// Updated scoring algorithm that checks subject separately
export const calculateScore = (
  subject: string,
  body: string,
): ScoreResult => {
  let subjectScore = 0;
  let bodyScore = 0;
  const triggeredKeywords: TriggeredKeyword[] = [];
  
  const lowerSubject = subject.toLowerCase();
  const lowerBody = body.toLowerCase();

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
        subjectIndices.push({ 
          start: lastIndex, 
          end: lastIndex + termToSearchLower.length 
        });
      }
      
      // Search in body
      lastIndex = -1;
      while ((lastIndex = lowerBody.indexOf(termToSearchLower, lastIndex + 1)) !== -1) {
        bodyOccurrences++;
        bodyIndices.push({ 
          start: lastIndex, 
          end: lastIndex + termToSearchLower.length 
        });
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
  
  // Calculate weighted total score (subject has more impact)
  // 40% subject, 60% body when both are present
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