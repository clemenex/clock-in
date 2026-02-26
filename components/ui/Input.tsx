import React from "react";
import { cn } from "./cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-sm font-medium",
        "focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-brand transition-all outline-none",
        className
      )}
      {...props}
    />
  );
}