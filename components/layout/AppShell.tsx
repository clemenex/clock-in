"use client";

import React from "react";
import { Clock, LayoutDashboard, FileText, FileSearch, Briefcase, LogOut } from "lucide-react";

type Props = {
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSignOut: () => void;
  children: React.ReactNode;
};

export function AppShell({ user, activeTab, setActiveTab, onSignOut, children }: Props) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "logs", label: "Log Sheet", icon: FileText },
    { id: "analytics", label: "History", icon: FileSearch },
    { id: "projects", label: "Directory", icon: Briefcase },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col antialiased">
      <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 transition-all shadow-sm h-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            <div className="bg-[#004AAD] p-2 rounded-xl text-white shadow-lg group-hover:rotate-6 transition-all duration-300">
              <Clock size={18} strokeWidth={3} />
            </div>
            <span className="text-xl font-bold tracking-tighter text-[#004AAD]">cLock In</span>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-slate-100/80 p-1 rounded-2xl border border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-semibold transition-all duration-300 hover:text-[#004AAD] ${
                  activeTab === tab.id ? "bg-white text-[#004AAD] shadow-sm" : "text-slate-500"
                }`}
              >
                <tab.icon size={13} strokeWidth={2.5} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onSignOut}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#004AAD] text-[10px] font-bold uppercase shadow-inner">
              {user?.email?.[0] || "U"}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Mobile nav */}
        <div className="md:hidden grid grid-cols-4 gap-1 mb-8 bg-white border border-slate-200 p-1 rounded-2xl shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex justify-center p-3 rounded-xl transition-all ${
                activeTab === tab.id ? "bg-[#004AAD] text-white shadow-md" : "text-slate-400"
              }`}
            >
              <tab.icon size={18} strokeWidth={2.5} />
            </button>
          ))}
        </div>

        {children}
      </main>

      <footer className="py-12 text-center bg-white border-t border-slate-100 mt-auto">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.3em]">
          cLock In • Supabase PostgreSQL
        </p>
      </footer>
    </div>
  );
}