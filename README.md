# SpamScore Email Analyzer

A modern React application that analyzes email content for spam triggers, highlighting problematic phrases and providing improvement suggestions.

## Features

- **Real-time Spam Analysis**: Analyzes subject lines and body content as you type
- **Visual Score Display**: Color-coded radial gauge displays spam risk level
- **Trigger Highlighting**: Automatically highlights potentially problematic words and phrases
- **Smart Scoring System**: Subject lines are weighted higher than body content
- **Improvement Suggestions**: Clear explanations and fixes for each spam trigger
- **Report Generation**: Export detailed reports in Markdown format
- **Dark/Light Mode**: Toggle between themes with persistent user preference

## Spam Detection

The app uses a comprehensive database of spam trigger words and patterns across four risk categories:
- 🔴 **RED**: High-risk terms that almost certainly trigger spam filters
- 🟠 **ORANGE**: Medium-risk promotional language
- 🟡 **YELLOW**: Low-risk but potentially problematic terms
- 🟢 **GREEN**: Promotional but generally acceptable terms

Additional spam indicators detected:
- ALL CAPS TEXT
- Multiple exclamation marks (!!!)
- Unrealistic promises and claims

## Setup and Installation

```bash
# Clone the repository
git clone https://github.com/icemusike/email-tools.git
cd SpamScore

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Vite

## License

MIT 