import React from "react";
import { cn } from "./cn";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-card border border-border shadow-sm rounded-[2rem]", className)}
      {...props}
    />
  );
}