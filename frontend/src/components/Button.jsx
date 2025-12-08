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
  variant = "primary",
  disabled = false,
  icon,
}) => {
  return (
    <button
      className={`button ${className} ${variant} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: padding || "12px 24px",
        color: color || "#f1f1f1",
        fontSize: fontSize || "1.1em",
        width,
        marginTop
      }}
    >
      <span>
        {icon && <span className="button-icon">{icon}</span>}
        {label}
      </span>
    </button>
  );
};

export default Button;
