# ESLint Configuration for React SSR Tests

This project uses ESLint to maintain code quality and consistency. The configuration is set up specifically for a React application with server-side rendering capabilities.

## Overview

The ESLint configuration is managed through the `eslint.config.js` file at the root of the project, which uses the new flat config format introduced in ESLint v9. This file defines various rules, plugins, and settings appropriate for our React codebase.

## Setup Details

### Installed Packages

- `eslint`: Core ESLint package
- `@eslint/js`: ESLint's built-in JavaScript rules
- `eslint-plugin-react`: React-specific linting rules
- `eslint-plugin-react-hooks`: Rules for React Hooks
- `eslint-plugin-react-refresh`: Support for React Fast Refresh

### Configuration Structure

The configuration is organized into several sections:

1. **Global ignores**: Defines files and directories to be excluded from linting
2. **JavaScript/JSX rules**: Base rules for all JS/JSX files
3. **Server-specific rules**: Special rules for server-side code
4. **Test-specific rules**: Rules tailored for test files

### Key Features

- **React Support**: Comprehensive rules for React component development
- **No PropTypes Requirement**: PropTypes validation is turned off
- **Console Restrictions**: Console usage is limited to `warn`, `error`, and `info` (except in server code)
- **Unused Variables**: Variables/parameters starting with underscore (`_`) are allowed
- **Contextual Rules**: Different rules for client vs. server code

## Available Commands

Run these commands from the project root:

- `npm run lint`: Check the entire codebase for linting issues
- `npm run lint:fix`: Automatically fix fixable issues
- `npm run lint:report`: Generate a detailed JSON report of all linting issues

## Editor Integration

A `.vscode/settings.json` file is included to help with VS Code integration, enabling:

- Format on save
- Fix all auto-fixable issues on save
- Proper file type validation

## Custom Rules

Several rules have been specifically configured for this project:

- **Arrow Function Style**: Encourages concise arrow function bodies
- **Import Handling**: Prevents duplicate imports
- **Binary Expressions**: Warns about potential issues with truthiness checks
- **Server Console Usage**: Allows unrestricted console usage in server code

## Maintenance

When adding new dependencies or changing project structure, you may need to update the ESLint configuration. Regularly running `npm run lint` helps catch issues early.