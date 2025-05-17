import React from "react";
import { hydrateRoot } from "react-dom/client";
import { LayoutApp } from "../server/page-builder/buildReactApp";

// Check if we have server-rendered data
const serverData = window.__SERVER_DATA__ || {};

// Hydrate the application
hydrateRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LayoutApp serverData={serverData} />
  </React.StrictMode>,
);
