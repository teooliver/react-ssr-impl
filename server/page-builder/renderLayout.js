import React from "react";
import { renderToString } from "react-dom/server";

import { buildReactApp } from "./buildReactApp.jsx";
import layout from "../../cms/layout.json";

// API base URL for fetching server-side props
const API_BASE_URL = "http://localhost:3333/api/";

/**
 * Renders the App component to HTML
 *
 * @returns {Promise<{ html: string, data: object }>} - The rendered HTML and any server data
 */
export async function renderLayoutToHtml() {
  try {
    // Create a simple server data object
    const serverData = {
      pageTitle: "Server-side rendered title",
    };

    // Render the App component directly
    const html = renderToString(buildReactApp(layout));

    return { html, data: serverData };
  } catch (error) {
    console.error("Error rendering app:", error);
    return {
      html: `<div class="error">Error rendering app: ${error.message}</div>`,
      data: {},
    };
  }
}

/**
 * Creates a full HTML document with the rendered app
 *
 * @param {string} appHtml - The rendered React app HTML
 * @param {object} serverData - The data fetched for server-side rendering
 * @returns {string} - The complete HTML document
 */
export function createHtmlDocument(appHtml, serverData) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>React App</title>
        <script type="module" src="/static/main.js" defer></script>
        <script>
          window.__SERVER_DATA__ = ${JSON.stringify(serverData)};
        </script>
      </head>
      <body>
        <div id="root">${appHtml}</div>
      </body>
    </html>
  `;
}
