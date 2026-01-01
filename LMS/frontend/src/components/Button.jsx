import React from "react";
import "../CSS/Button.css";

const Button = ({
  label,
  onClick,
  padding,
  color,
  fontSize,
  width,
  marginTop,
  className,
}) => {
  return (
    <button
      className={`button ${className}`} // Include custom class
      onClick={onClick}
      style={{ padding, color, fontSize, width, marginTop }}
    >
      <span>{label}</span>
    </button>
  );
};

export default Button;
