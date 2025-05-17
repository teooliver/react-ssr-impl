import React from "react";

export const Card = ({ header, body }) => {
  return (
    <div className="card">
      <div className="card-header">{header || "Card Header"}</div>
      <div className="card-body">{body || "Card Body"}</div>
      <button onClick={() => console.log("click click")}>Click Me</button>
    </div>
  );
};
