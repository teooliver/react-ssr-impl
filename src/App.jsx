import React from "react";
import { Card } from "./Card";
import { Count } from "./Count";

export function App() {
  return (
    <>
      <Card />
      <Card />
      <Count btnID={"count-button"} />
    </>
  );
}

