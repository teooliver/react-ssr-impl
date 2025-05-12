# React SSR with Hono

This project demonstrates a React application with server-side rendering (SSR) using the Hono framework.

## Features

- Server-side rendering with React 19
- Client-side hydration
- Bundled client-side JavaScript
- Fast and lightweight Hono server

## Quick Start

```bash
# Install dependencies
npm install

# Build both server and client
npm run build:all

# Start the server
npm run start
```

Visit `http://localhost:3000` to see the application.

## Development

For development with hot reloading:

```bash
npm run dev
```

## Build Process

The build process consists of two parts:

1. Server-side code compilation
   ```bash
   npm run build
   ```

2. Client-side bundling (includes all dependencies)
   ```bash
   npm run build:client
   ```

3. Full build (both client and server)
   ```bash
   npm run build:all
   ```

## Project Structure

- `/src` - React components and client-side entry point
- `/server` - Hono server configuration
- `/server/static` - Bundled client-side JavaScript
- `/build` - Compiled server-side code

## How It Works

1. The server renders React components to HTML on the server
2. The HTML is sent to the client with a reference to the bundled JS
3. The client loads the bundled JS and hydrates the server-rendered HTML
4. The application becomes interactive

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build server-side code
- `npm run build:client` - Build client-side bundle
- `npm run build:all` - Build both server and client
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## Dependencies

- React 19
- Hono
- Vite

## License

MIT