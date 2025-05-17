import React from "react";
import { Card } from "./Card";
import { Count } from "./Count";
import { Header } from "./Header";

export function App() {
  return (
    <>
      <Header pageTitle={"Some title"} />
      <Card />
      <Card />
      <Count btnID={"count-button"} />
    </>
  );
}
