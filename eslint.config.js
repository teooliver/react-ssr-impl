import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'

// Set up React plugin configuration
const reactConfig = {
  settings: {
    react: {
      version: "19.1.0", // This should match your React version
    },
  },
};

// Define React-specific rules
const reactRules = {
  // React Hooks rules
  ...reactHooks.configs.recommended.rules,
  
  // React plugin rules
  ...react.configs.recommended.rules,
  'react/jsx-uses-react': 'error',
  'react/jsx-uses-vars': 'error',
  'react/no-direct-mutation-state': 'error',
  'react/jsx-no-undef': 'error',
  'react/no-unknown-property': 'error',
  'react/jsx-key': 'error',
  'react/jsx-no-duplicate-props': 'error',
  
  // Disable prop-types rule
  'react/prop-types': 'off',

  // React Refresh plugin rules
  'react-refresh/only-export-components': [
    'warn',
    { allowConstantExport: true },
  ],
}

export default [
  // Ignore build directories
  { ignores: [
    'dist/**',
    'build/**',
    'node_modules/**',
    'server/static/**',
    'coverage/**',
    '**/*.min.js',
    '**/*.log',
    'stats.json',
    '.vscode/**',
    '.idea/**',
    '.DS_Store',
    '.git/**',
    '.github/**',
    'package-lock.json',
    'yarn.lock'
  ] },
  
  // Global JS rules
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node,
        JSX: 'readonly',
        React: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { 
          jsx: true,
          impliedStrict: true,
        },
        sourceType: 'module',
      },
    },
    plugins: {
      'react': react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // JS standard rules
      ...js.configs.recommended.rules,
      
      // Common JS rules
      'no-unused-vars': ['warn', { 
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'warn',
      'no-alert': 'warn',
      'prefer-const': 'error',
      'arrow-body-style': ['warn', 'as-needed'],
      'no-duplicate-imports': 'error',
      'no-constant-binary-expression': 'warn',
      
      // React rules
      ...reactRules,
    },
    ...reactConfig,
  },
  
  // Server-specific rules
  {
    files: ['**/server/**/*.{js,jsx}', '**/scripts/**/*.{js,jsx}', '**/props-server/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
      'arrow-body-style': 'off',
    },
  },
  
  // Test file rules
  {
    files: ['**/*.test.{js,jsx}', '**/*.spec.{js,jsx}', '**/tests/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
        expect: 'readonly',
        it: 'readonly',
        describe: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
  }
]
