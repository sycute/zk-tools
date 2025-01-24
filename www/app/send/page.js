"use client";
import React, { useState } from "react";

const Send = () => {
  const [color, setColor] = useState("white");
  return (
    <div
      className={`w-28  h-28 bg-${color} `}
      onClick={() => {
        setColor(color == "white" ? "red-600" : "white");
      }}
    >
    </div>
  );
};
export default Send;
