import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

// Create the Hono app
const app = new Hono();

// Enable CORS
app.use("/*", cors());

// API endpoint for random 3-word text
app.get("/api/pageTitle", (c) => {
  const title = "Some HardCoded Title Example";
  return c.json({
    content: title,
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint for testing
app.get("/", (c) => {
  return c.text(
    "Hello from the Layout Builder Engine Server! Try /api/pageTitle endpoint.",
  );
});

// Start the server
const port = process.env.PORT || 3333;
serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(
      `Layout Builder Engine Server is running on http://localhost:${info.port}`,
    );
  },
);
