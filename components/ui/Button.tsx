"use client";

import React from "react";
import { cn } from "./cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed";

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-[rgb(var(--brand))] text-white hover:bg-[rgb(var(--brand-strong))] shadow-lg shadow-blue-100",
    secondary:
      "bg-slate-100 text-[rgb(var(--text))] hover:bg-slate-200 border border-[rgb(var(--border))]",
    ghost:
      "text-slate-500 hover:text-[rgb(var(--brand))] hover:bg-slate-50",
    danger: "text-red-600 hover:bg-red-50",
  };

  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "px-3 py-2 rounded-lg text-xs",
    md: "px-5 py-3 rounded-xl text-sm",
    lg: "px-6 py-3.5 rounded-xl text-sm font-bold",
  };

  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}