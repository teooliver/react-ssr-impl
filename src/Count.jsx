
import React from "react";

export const Count = ({ btnID }) => {
    const [count, setCount] = React.useState(0);
    return (
      <div key={btnID} >
        <button onClick={() => setCount(prev => prev + 1)}>{count}</button>
      </div>
    );
  };
  