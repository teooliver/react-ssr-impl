import React from "react";
import { hydrateRoot } from "react-dom/client";
import { App } from "./App";

// Hydrate the application
const root = document.getElementById("root");
if (root) {
  hydrateRoot(
    root,
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
