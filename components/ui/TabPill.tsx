"use client";

import React from "react";
import { cn } from "./cn";

type Props = {
  active: boolean;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  onClick: () => void;
};

export function TabPill({ active, label, icon: Icon, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-semibold transition-all duration-300",
        "hover:text-[rgb(var(--brand))]",
        active ? "bg-white text-[rgb(var(--brand))] shadow-sm" : "text-slate-500"
      )}
    >
      <Icon size={13} strokeWidth={2.5} /> {label}
    </button>
  );
}