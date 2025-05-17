import React from "react";
const Count = ({ btnID }) => {
  const [count, setCount] = React.useState(0);
  return /* @__PURE__ */ React.createElement("div", { key: btnID }, /* @__PURE__ */ React.createElement("p", null, "Counter Button"), /* @__PURE__ */ React.createElement("button", { onClick: () => setCount((prev) => prev + 1) }, count));
};
export {
  Count
};
