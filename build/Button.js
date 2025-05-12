import React from "react";
const Button = ({ btnID }) => {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", { onClick: () => console.log("clicking", btnID) }, btnID));
};
export {
  Button
};
