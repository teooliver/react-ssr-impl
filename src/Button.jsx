import React from "react";
export const Button = ({ btnID }) => {
  return (
    <div>
      <button onClick={() => console.log("clicking", btnID)}>{btnID}</button>
    </div>
  );
};
