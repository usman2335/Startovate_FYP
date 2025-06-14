import React from "react";

const Button = ({
  label,
  onClick,
  padding,
  color,
  fontSize,
  width,
  marginTop,
  className = "",
}) => {
  const styleProps = {
    padding,
    color: "blue", // Tailwind handles text/background classes
    fontSize: 5,
    width,
    marginTop,
  };

  return (
    <button
      onClick={onClick}
      style={styleProps}
      className={`
        ${width ?? "w-full"} py-2 px-4 
        ${fontSize ?? "text-base md:text-lg"} 
        rounded flex items-center justify-center cursor-pointer 
        hover:bg-blue-900 transition duration-300 ease-in-out
        ${color ?? "bg-primary-blue text-white"} ${className}
      `}
    >
      <span>{label}</span>
    </button>
  );
};

export default Button;
