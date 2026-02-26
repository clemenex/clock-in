"use client";

import React from "react";
import { Clock, LayoutDashboard, FileText, FileSearch, Briefcase, LogOut } from "lucide-react";
import { IconButton } from "../ui/IconButton";
import { TabPill } from "../ui/TabPill";
import { TabIconButton } from "../ui/TabIconButton";

type Props = {
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onProfileClick: () => void;
  avatarUrl?: string | null;
  displayName?: string | null;
  onSignOut: () => void;
  children: React.ReactNode;
};

export function AppShell({ user, activeTab, setActiveTab, onSignOut, onProfileClick, avatarUrl= null, displayName = null, children }: Props) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "logs", label: "Log Sheet", icon: FileText },
    { id: "analytics", label: "History", icon: FileSearch },
    { id: "projects", label: "Directory", icon: Briefcase },
  ] as const;

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] font-sans text-[rgb(var(--text))] flex flex-col antialiased">
      <nav className="bg-white/90 backdrop-blur-xl border-b border-[rgb(var(--border))] sticky top-0 z-50 transition-all shadow-sm h-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <button type="button" className="flex items-center gap-3 group" onClick={() => setActiveTab("dashboard")}>
            <div className="bg-[rgb(var(--brand))] p-2 rounded-xl text-white shadow-lg group-hover:rotate-6 transition-all duration-300">
              <Clock size={18} strokeWidth={3} />
            </div>
            <span className="text-xl font-bold tracking-tighter text-[rgb(var(--brand))]">cLock In</span>
          </button>

          <div className="hidden md:flex items-center gap-2 bg-slate-100/80 p-1 rounded-2xl border border-[rgb(var(--border))]">
            {tabs.map((tab) => (
              <TabPill
                key={tab.id}
                active={activeTab === tab.id}
                label={tab.label}
                icon={tab.icon}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <IconButton variant="danger" onClick={onSignOut} title="Sign Out" aria-label="Sign Out">
              <LogOut size={20} />
            </IconButton>

            <button
              type="button"
              onClick={onProfileClick}
              className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[rgb(var(--brand))] text-[10px] font-bold uppercase shadow-inner overflow-hidden"
              title="Profile"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{(displayName?.[0] || user?.email?.[0] || "U").toUpperCase()}</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="md:hidden grid grid-cols-4 gap-1 mb-8 bg-white border border-[rgb(var(--border))] p-1 rounded-2xl shadow-sm">
          {tabs.map((tab) => (
            <TabIconButton
              key={tab.id}
              active={activeTab === tab.id}
              icon={tab.icon}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>

        {children}
      </main>

      <footer className="py-12 text-center bg-white border-t border-slate-100 mt-auto">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.3em]">cLock In • Supabase PostgreSQL</p>
      </footer>
    </div>
  );
}