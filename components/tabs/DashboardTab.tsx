"use client";

import React from "react";
import { Plus, TrendingUp, Zap, Users, Activity, Target, BarChart3, Coffee, PieChart } from "lucide-react";

type Props = {
  metrics: any; // keep as-is for now
  weeklyGoal: number;
  onNewEntry: () => void;
};

export function DashboardTab({ metrics, weeklyGoal, onNewEntry }: Props) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Performance Summary</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Holistic view of your internship progression.</p>
        </div>
        <button
          onClick={onNewEntry}
          className="bg-[#004AAD] text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-xl shadow-blue-100 hover:bg-[#003A8A] transition-all flex items-center gap-2 active:scale-95 duration-300"
        >
          <Plus size={16} strokeWidth={3} /> New Entry
        </button>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Hours",
            val: (metrics?.totalHoursAll || 0).toFixed(1) + "h",
            icon: TrendingUp,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Avg Session",
            val: (metrics?.avgTaskDuration || 0).toFixed(1) + "h",
            icon: Zap,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Meeting Ratio",
            val: (metrics?.meetingRatio || 0).toFixed(0) + "%",
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            label: "Focus Score",
            val: (100 - (metrics?.meetingRatio || 0)).toFixed(0) + "%",
            icon: Activity,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
        ].map((kpi, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className={`${kpi.bg} ${kpi.color} w-8 h-8 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500`}>
              <kpi.icon size={16} strokeWidth={2.5} />
            </div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-slate-900 leading-tight">{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-all duration-300">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6 self-start flex items-center gap-2">
            <Target size={14} className="text-[#004AAD]" /> Weekly Progress
          </h3>
          <div className="relative w-40 h-40 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-slate-100" />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={439.8}
                strokeDashoffset={439.8 - (Math.min(metrics?.weeklyTotal || 0, weeklyGoal) / (weeklyGoal || 1)) * 439.8}
                className="text-[#004AAD] transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-900 leading-none">
                {Math.round(((metrics?.weeklyTotal || 0) / (weeklyGoal || 1)) * 100)}%
              </span>
              <span className="text-[11px] font-medium text-slate-500 uppercase mt-1">Goal</span>
            </div>
          </div>
          <p className="text-base font-semibold text-slate-800">
            {(metrics?.weeklyTotal || 0).toFixed(1)} / {weeklyGoal}h
          </p>
        </div>

        <div className="lg:col-span-8 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden h-full hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-3">
              <BarChart3 size={18} className="text-[#004AAD]" /> Intensity Trends
            </h3>
          </div>
          <div className="h-44 flex items-end justify-between gap-3 sm:gap-6 px-2">
            {metrics?.last7?.map((d: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group h-full">
                <div className="w-full relative flex flex-col items-center justify-end h-full">
                  <div
                    className={`w-full max-w-[40px] rounded-xl transition-all duration-700 relative cursor-pointer ${
                      d.isToday
                          ? 'bg-[#004AAD] shadow-xl ring-4 ring-blue-50'
                          : 'bg-[#004AAD]/18 hover:bg-[#004AAD]/28'
                    }`}
                    style={{ height: `${Math.max((d.hours / 12) * 100, 6)}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-20 whitespace-nowrap shadow-xl">
                      {Number(d.hours || 0).toFixed(1)}h
                    </div>
                  </div>
                </div>
                <span className={`text-[11px] font-semibold uppercase tracking-tighter transition-colors ${d.isToday ? "text-[#004AAD]" : "text-slate-500"}`}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm group hover:shadow-md transition-all duration-300">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Zap size={14} className="text-amber-500 group-hover:animate-pulse" /> Significant Milestone
          </h3>
          <div className="bg-amber-50/50 p-6 rounded-[1.5rem] border border-amber-100 flex flex-col justify-center min-h-[140px] relative overflow-hidden group-hover:bg-amber-50 transition-colors duration-500">
            <Coffee size={48} className="absolute -bottom-2 -right-2 text-amber-200/40 transform rotate-12 group-hover:scale-110 transition-transform duration-700" />
            <p className="text-[11px] font-bold text-amber-600 uppercase tracking-widest mb-2">Deep Work Peak</p>
            <p className="text-lg font-bold text-slate-900 leading-tight mb-3">"{metrics?.longestActivity?.description}"</p>
            <span className="text-xs font-bold text-amber-600 bg-white border border-amber-100 px-3 py-1 rounded-full shadow-sm w-fit">
              {Number(metrics?.longestActivity?.time || 0).toFixed(1)}h Session
            </span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
            <PieChart size={14} className="text-indigo-500" /> Time Distribution
          </h3>
          <div className="space-y-4">
            {metrics?.projectStats?.slice(0, 4).map((stat: any, i: number) => (
              <div key={i} className="space-y-1.5 group">
                <div className="flex justify-between text-[11px] font-semibold uppercase tracking-tighter">
                  <span className="text-slate-700 truncate max-w-[140px] group-hover:text-[#004AAD] transition-colors">
                    {stat.name}
                  </span>
                  <span className="text-slate-400 group-hover:text-slate-600 transition-colors">{Number(stat.percent || 0).toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000 ease-in-out shadow-sm" style={{ width: `${stat.percent}%`, backgroundColor: stat.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}