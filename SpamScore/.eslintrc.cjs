module.exports = {
  root: true,
  env: { browser: true, es2020: true, jest: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'airbnb-typescript',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', 'postcss.config.js', 'tailwind.config.js', 'jest.config.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json', // Default project for root config
  },
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off', // Not needed for Vite/React 17+
    'react/jsx-props-no-spreading': 'off', // Can be useful
    'import/prefer-default-export': 'off', // Named exports are fine
    '@typescript-eslint/no-explicit-any': 'warn', // Prefer specific types, but warn for now
    'no-param-reassign': ['warn', { props: true, ignorePropertyModificationsFor: ['draft'] }], // Allow for Immer
  },
  overrides: [
    {
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      parserOptions: {
        project: ['./tsconfig.app.json'], // Specify tsconfig.app.json for src files
      },
    },
    {
      files: ['*.cjs', '*.js'], // For config files like .eslintrc.cjs, jest.config.cjs etc.
      parserOptions: {
        project: null, // Don't use project reference for .cjs files
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off', // Allow require in CJS files
      }
    }
  ]
}; 