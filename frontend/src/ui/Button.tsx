import type { ReactElement } from "react";
import { Spinner } from "./icons/Spinner";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick: () => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
}

const variantStyles = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  secondary: "bg-white text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
  outline:
    "border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export const Button = ({
  variant = "primary",
  size = "md",
  text,
  startIcon,
  endIcon,
  onClick,
  className = "",
  loading = false,
  disabled = false,
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center rounded-md font-medium
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Spinner size={4} />
          Processing
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {startIcon}
          {text}
          {endIcon}
        </span>
      )}
    </button>
  );
};
