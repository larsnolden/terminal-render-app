import React from "react";

const colors = {
  blue: {
    background: "bg-sky-400",
    text: "text-sky-800",
  },
};

const Pill = ({ children, color, className }) => (
  <div
    className={`${colors[color].background} rounded-lg p-2 h-auto h-min ${className}`}
  >
    <div className={colors[color].text}>{children}</div>
  </div>
);

export default Pill;
