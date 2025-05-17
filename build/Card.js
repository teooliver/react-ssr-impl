import React from "react";
const Card = ({ header, body }) => {
  return /* @__PURE__ */ React.createElement("div", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "card-header" }, header || "Card Header"), /* @__PURE__ */ React.createElement("div", { className: "card-body" }, body || "Card Body"), /* @__PURE__ */ React.createElement("button", { onClick: () => console.log("click click") }, "Click Me"));
};
export {
  Card
};
