import React from "react";
import { renderToString } from "react-dom/server";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { App } from "../build/App.js"; // Adjust the path as necessary
import { serveStatic } from "@hono/node-server/serve-static";
import { createElement } from "react";
import { createServer } from "node:http";

const app = new Hono();
// Serve bundled static files from the server/static directory
app.use("/static/*", serveStatic({ root: "./server" }));
app.use("/assets/*", serveStatic({ root: "./dist" }));

app.get("/", (c) => {
  const appHtml = renderToString(createElement(App));
  const indexHtml = `
    <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="module" src="/static/main.js" defer></script>
    <title>React + Vite + SSR</title>
  </head>
  <body>
    <div id="root">${appHtml}</div>
  </body>
</html>
    `;
  return c.html(indexHtml);
});

// Function to find an available port
const findAvailablePort = async (startPort) => {
  let port = startPort;

  while (true) {
    try {
      await new Promise((resolve, reject) => {
        const server = createServer();
        server.on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            port++;
            resolve(false);
          } else {
            reject(err);
          }
        });

        server.listen(port, () => {
          server.close(() => resolve(true));
        });
      });

      return port;
    } catch (err) {
      console.error('Error finding available port:', err);
      port++;
    }
  }
};

// Start the server on an available port
(async () => {
  const port = await findAvailablePort(3000);
  
  serve({
    fetch: app.fetch,
    port
  }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  });
})();
