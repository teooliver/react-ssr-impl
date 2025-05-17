import React from "react";
import { renderToString } from "react-dom/server";
import path from "path";
import { fileURLToPath } from "url";

import { loadAppComponent } from "./buildReactApp.js";

// Get the current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    // Load the App component directly from the build folder
    const App = loadAppComponent();
    
    if (!App) {
      throw new Error("Failed to load App component");
    }

    // Render the App component directly
    const html = renderToString(React.createElement(App));

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
