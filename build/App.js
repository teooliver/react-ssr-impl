import React from "react";
import { Card } from "./Card.js";
import { Count } from "./Count.js";
function App() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Card, null), /* @__PURE__ */ React.createElement(Card, null), /* @__PURE__ */ React.createElement(Count, { btnID: "count-button" }));
}
export {
  App
};
