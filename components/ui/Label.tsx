import React from "react";
import { cn } from "./cn";

export function Label({ className, ...props }: React.HTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1", className)} {...props} />
  );
}