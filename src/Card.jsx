import React from "react";

export const Card = ({ header, body }) => (
    <div className="card">
      <div className="card-header">{header || "Card Header"}</div>
      <div className="card-body">{body || "Card Body"}</div>
      <button onClick={() => console.info("click click")}>Click Me</button>
    </div>
  );
