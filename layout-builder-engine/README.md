# Layout Builder Engine

This grabs the layout json and put it together by mathing the components from the components table, and fetching their data before hand

## Hono.js Server

A simple, independent API server is included in this folder.

### Features:
- Completely independent from the main application
- Provides an API endpoint at `/api/cardContent` that returns randomly generated 3-word text
- Runs on port 3333 by default

### Setup and Usage:

```bash
# Install dependencies
npm install

# Start the server
npm start
```

### API Endpoints:

#### GET /api/cardContent
Returns a JSON object with:
- `content`: A randomly generated 3-word text
- `timestamp`: The time when the request was processed

Example response:
```json
{
  "content": "apple blue cheese",
  "timestamp": "2023-11-01T12:34:56.789Z"
}
```

You can test the endpoint by visiting `http://localhost:3333/api/cardContent` in your browser.
