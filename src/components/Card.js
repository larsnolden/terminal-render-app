import React from "react";

const Card = ({ className, children }) => (
  <div className={`bg-white drop-shadow-xl p-8 rounded-lg ${className}`}>
    {children}
  </div>
);

export default Card;
