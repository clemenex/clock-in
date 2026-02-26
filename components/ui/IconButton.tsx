"use client";

import React from "react";
import { cn } from "./cn";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "ghost" | "danger";
};

export function IconButton({ variant = "ghost", className, ...props }: IconButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    ghost: "text-slate-400 hover:text-[rgb(var(--brand))] hover:bg-slate-50",
    danger: "text-slate-400 hover:text-red-500 hover:bg-red-50",
  };

  return <button className={cn(base, "p-2", variants[variant], className)} {...props} />;
}