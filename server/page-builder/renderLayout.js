import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import { componentRegistry } from "../../cms/components.js";
import layout from "../../cms/layout.json";
import fetch from "node-fetch";

// Import all components
import * as components from "../build/index.js";

// API base URL for fetching server-side props
const API_BASE_URL = "http://localhost:3333/api/";

/**
 * Builds a React component tree from layout configuration
 * @param {Object} layoutNode - Layout configuration node
 * @param {Object} serverData - Server-side data
 * @returns {React.ReactElement} Component tree
 */
function buildComponent(layoutNode, serverData = {}) {
  if (!layoutNode || !layoutNode.component) {
    return null;
  }

  // Find component configuration
  const componentId = layoutNode.component;
  const componentConfig = componentRegistry[componentId];

  if (!componentConfig) {
    console.warn(
      `Component with ID "${componentId}" not found in components registry`,
    );
    return null;
  }

  // Get the React component dynamically
  const Component = components[componentConfig.name];

  if (!Component) {
    console.warn(
      `Component implementation for "${componentConfig.name}" not found`,
    );
    return null;
  }

  // Prepare props with both layout props and server props
  const props = { ...layoutNode.props };

  // Add server-side props if available
  if (componentConfig.serverSideProps && serverData[componentId]) {
    componentConfig.serverSideProps.forEach((propName) => {
      if (serverData[componentId][propName]) {
        props[propName] = serverData[componentId][propName];
      }
    });
  }

  // Process children
  const children =
    layoutNode.children
      ?.map((child) => buildComponent(child, serverData))
      .filter(Boolean) || null;

  // Create the component with props
  return React.createElement(
    Component,
    { key: layoutNode.id, ...props },
    children,
  );
}

/**
 * Fetch server-side props for components that require them
 * @param {Object} layout - The layout configuration
 * @returns {Promise<Object>} - Object mapping component IDs to their fetched props
 */
async function fetchServerProps(layout) {
  const result = {};

  // Helper function to recursively find components with serverSideProps
  async function processNode(node) {
    if (!node || !node.component) return;

    const componentId = node.component;
    const componentConfig = componentRegistry[componentId];

    // Check if component has serverSideProps
    if (componentConfig?.serverSideProps?.length > 0) {
      result[componentId] = {};

      // Fetch each prop from the API
      await Promise.all(
        componentConfig.serverSideProps.map(async (propName) => {
          try {
            const response = await fetch(`${API_BASE_URL}${propName}`);
            if (response.ok) {
              const data = await response.json();
              result[componentId][propName] = data;
            } else {
              console.error(
                `Failed to fetch ${propName} for ${componentConfig.name}: ${response.statusText}`,
              );
            }
          } catch (error) {
            console.error(
              `Error fetching ${propName} for ${componentConfig.name}:`,
              error,
            );
            // Provide fallback data
            result[componentId][propName] = {
              fallback: true,
              content: "Failed to load data",
            };
          }
        }),
      );
    }

    // Process children recursively
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        await processNode(child);
      }
    }
  }

  await processNode(layout);
  return result;
}

/**
 * Renders the layout to HTML
 *
 * @returns {Promise<{ html: string, data: object }>} - The rendered HTML and any server data
 */
export async function renderLayoutToHtml() {
  try {
    // Fetch server-side data from API
    const serverData = await fetchServerProps(layout);

    // Build the component tree with server data
    const app = buildComponent(layout, serverData);

    if (!app) {
      throw new Error("Failed to build app from layout");
    }

    const html = renderToString(app);

    return { html, data: serverData };
  } catch (error) {
    console.error("Error rendering layout:", error);
    return {
      html: `<div class="error">Error rendering layout: ${error.message}</div>`,
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
        <title>Layout-Driven React App</title>
        <script type="module" src="/static/layout.js" defer></script>
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
