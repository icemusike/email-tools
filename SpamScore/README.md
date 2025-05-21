# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# Email Tools

A collection of tools for email marketing including:

- **Spam Score Checker**: Analyze email content for spam triggers and improve deliverability
- **Subject Generator**: AI-powered email subject line generator with different styles
- **Subject Line Tester**: Test and analyze the effectiveness of email subject lines
- **Template Builder**: Build responsive email templates
- **Deliverability Analyzer**: Analyze email deliverability factors
- **Unsubscribe Link Generator**: Generate compliant unsubscribe links

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/email-tools.git
cd email-tools
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env`
   - Add your OpenAI API key to the `.env` file:
```bash
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

## Features

### Spam Score Checker
- Analyzes email content for spam triggers
- Highlights problematic words and phrases
- Provides suggestions for improvement
- Generates a detailed report

### Subject Generator
- Creates high-converting subject lines using AI
- Supports multiple styles (Prelaunch, Curiosity, Scarcity, etc.)
- Uses OpenAI's latest models for best results

## Technologies

- React 
- TypeScript
- Vite
- Tailwind CSS
- OpenAI API

## Environment Variables

The following environment variables are required:

- `VITE_OPENAI_API_KEY`: Your OpenAI API key for the Subject Generator

## Development

To run the development server:

```bash
npm run dev
```

To build for production:

```bash
npm run build
```

## License

MIT
