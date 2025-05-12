import React from "react";
import { Button } from "./Button";

export const Card = () => {
  return (
    <div className="card">
      <div className="card-header">Card Header</div>
      <div className="card-body">Card Body</div>
      <Button btnID={"button 01"} />
      <Button btnID={"button 02"} />
      <Button btnID={"button 03"} />
    </div>
  );
};
