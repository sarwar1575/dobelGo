import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      disabled,
      isLoading,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyle =
      "w-full font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50";

    const variants = {
      primary:
        "bg-yellow-500 hover:bg-yellow-600 text-black",
      secondary:
        "bg-gray-200 hover:bg-gray-300 text-black",
    };

    const combinedClassName = `${baseStyle} ${variants[variant]} ${className}`;

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClassName}
        {...props}
      >
        {isLoading ? "Loading..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";
