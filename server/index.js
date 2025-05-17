import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import {
  createHtmlDocument,
  renderLayoutToHtml,
} from "./page-builder/renderLayout.js";

const app = new Hono();
// Serve bundled static files from the server/static directory
app.use("/static/*", serveStatic({ root: "./server" }));
app.use("/assets/*", serveStatic({ root: "./dist" }));

// Add layout-driven rendering route
app.get("/somepage", async (c) => {
  const { html, data } = await renderLayoutToHtml();
  const fullHtml = createHtmlDocument(html, data);

  return c.html(fullHtml);
});

// Start the server
(async () => {
  serve(
    {
      fetch: app.fetch,
      port: 3006,
    },
    (info) => {
      console.log(`Server is running on http://localhost:${info.port}`);
    },
  );
})();
