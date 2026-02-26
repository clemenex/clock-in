"use client";

import React from "react";
import { cn } from "./cn";

type Props = {
  active: boolean;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  onClick: () => void;
};

export function TabIconButton({ active, icon: Icon, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex justify-center p-3 rounded-xl transition-all",
        active ? "bg-[rgb(var(--brand))] text-white shadow-md" : "text-slate-400"
      )}
    >
      <Icon size={18} strokeWidth={2.5} />
    </button>
  );
}