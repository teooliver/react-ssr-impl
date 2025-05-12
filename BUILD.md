# Build Documentation

## Project Overview

This project is a React application with server-side rendering (SSR) using Hono as the server framework. The build process compiles both server-side and client-side code to enable hydration of server-rendered content.

## Build Process

### Client-Side Bundle

The client-side bundle (`main.js`) is created with the following features:
- All React dependencies are bundled into a single file
- Output is placed in `server/static/main.js` for serving via Hono
- TypeScript/JSX is compiled to JavaScript
- Code is minified for production use

### Server-Side Code

The server-side code processes React components for SSR:
- Converts JSX to JS
- Processes import paths
- Handles component dependencies
- Output is placed in the `build` directory

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Builds the server-side code |
| `npm run build:client` | Builds the client-side bundle with all dependencies |
| `npm run build:all` | Runs both build processes |
| `npm run start` | Starts the Hono server |
| `npm run dev` | Runs the development server with Vite |

## Build Configuration

The build process is configured in two main files:

1. `vite.config.js` - Contains plugins for:
   - React JSX processing
   - App component transformation
   - Build output configuration

2. `build-client.js` - Dedicated script for bundling client-side code:
   - Uses Vite API programmatically
   - Bundles all dependencies
   - Outputs to `server/static`

## Development Workflow

1. Run `npm run dev` for local development
2. Make changes to components in the `src` directory
3. For production builds:
   - Run `npm run build:all`
   - Run `npm run start` to start the server

## Folder Structure

- `src/` - Source React components
- `build/` - Compiled server-side code
- `server/` - Hono server code
- `server/static/` - Location for client-side bundles
- `public/` - Static assets

## Notes

- The server serves the bundled client JS from `/static/main.js`
- Hydration occurs on the client using the same component tree rendered on the server