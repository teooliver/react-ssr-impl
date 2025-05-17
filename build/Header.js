import React, { useEffect, useState } from "react";
const Header = ({ pageTitle }) => {
  const [title, setTitle] = useState(pageTitle || "Loading...");
  useEffect(() => {
    if (pageTitle) {
      setTitle(pageTitle);
      return;
    }
    async function fetchTitle() {
      try {
        const response = await fetch("http://localhost:3333/api/pageTitle");
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title || data.content || "Default Title");
        } else {
          console.error("Failed to fetch page title");
        }
      } catch (error) {
        console.error("Error fetching page title:", error);
      }
    }
    fetchTitle();
  }, [pageTitle]);
  return /* @__PURE__ */ React.createElement("header", null, /* @__PURE__ */ React.createElement("h1", null, title), /* @__PURE__ */ React.createElement("p", { className: "source" }, pageTitle ? "Server-rendered" : "Client-fetched"));
};
export {
  Header
};
