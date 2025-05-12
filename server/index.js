import React from "react";
import { renderToString } from "react-dom/server";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { App } from "../build/App.js"; // Adjust the path as necessary
import { serveStatic } from "@hono/node-server/serve-static";
import { createElement } from "react";

const app = new Hono();
// Serve bundled static files from the server/static directory
app.use("/static/*", serveStatic({ root: "./server" }));

app.get("/", (c) => {
  const appHtml = renderToString(createElement(App));
  const indexHtml = `
    <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
    <script type="module" src="/static/main.js" defer></script>
  </head>
  <body>
    <div id="root">${appHtml}</div>
  </body>

</html>
    `;
  return c.html(indexHtml);
});

serve(app);
