import React from "react";
import { StrictMode } from "react";
import { App } from "./App.jsx";
import { hydrateRoot } from "react-dom/client";
hydrateRoot(document.getElementById("root")).render(
  /* @__PURE__ */ React.createElement(StrictMode, null, /* @__PURE__ */ React.createElement(App, null))
);
