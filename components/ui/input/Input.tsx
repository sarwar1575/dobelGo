import React, { InputHTMLAttributes, LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils"; // A common helper for Tailwind class merging

// --- Label Component ---
interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = ({ children, className, ...props }: LabelProps) => (
  <label 
    {...props} 
    className={cn("block text-sm font-semibold text-gray-700 mb-1.5", className)}
  >
    {children}
  </label>
);

// --- Input Component ---
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          {...props}
          className={cn(
            "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            error ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200",
            className
          )}
        />
        {error && (
          <p className="mt-1.5 text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";