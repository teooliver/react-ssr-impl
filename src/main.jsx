import React from "react";
import { StrictMode } from "react";
import { App } from "./App.jsx";
import { hydrateRoot } from "react-dom/client";

hydrateRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
