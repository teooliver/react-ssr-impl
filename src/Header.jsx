import React, { useEffect, useState } from "react";

export const Header = ({ pageTitle }) => {
  const [title, setTitle] = useState(pageTitle || "Loading...");
  
  useEffect(() => {
    // If pageTitle was provided from server props, use it
    if (pageTitle) {
      setTitle(pageTitle);
      return;
    }
    
    // Otherwise fetch it from API
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
  
  return (
    <header>
      <h1>{title}</h1>
      <p className="source">{pageTitle ? "Server-rendered" : "Client-fetched"}</p>
    </header>
  );
};
