"use client";

import React from "react";
import { Calendar, FileText, Trash2, BookOpen, CheckCircle2, Save, Check } from "lucide-react";

type Props = {
  date: string;
  setDate: (v: string) => void;
  saveDailyLog: () => void;
  saveStatus: string;

  rawInput: string;
  setRawInput: (v: string) => void;

  keyLearnings: string;
  setKeyLearnings: (v: string) => void;

  tasks: any[];
  projects: any[];
  handleUpdateTask: (index: number, field: string, value: string) => void;
};

export function LogsTab({
  date,
  setDate,
  saveDailyLog,
  saveStatus,
  rawInput,
  setRawInput,
  keyLearnings,
  setKeyLearnings,
  tasks,
  projects,
  handleUpdateTask,
}: Props) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-[#004AAD] transition-colors duration-300">
          <Calendar size={18} className="text-[#004AAD]" />
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider leading-tight">Session Date</p>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full text-sm font-medium text-slate-800 border-none p-0 focus:ring-0 bg-transparent cursor-pointer"
            />
          </div>
        </div>

        <div className="sm:col-span-8 flex gap-2">
          <button
            onClick={saveDailyLog}
            className={`flex-1 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all shadow-lg active:scale-[0.98] duration-200 ${
              saveStatus === "saved"
                ? "bg-emerald-500 text-white shadow-emerald-100"
                : "bg-[#004AAD] text-white hover:bg-[#003A8A]"
            }`}
          >
            {saveStatus === "saving" ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : saveStatus === "saved" ? (
              <Check size={18} strokeWidth={3} />
            ) : (
              <Save size={18} />
            )}
            {saveStatus === "saved" ? "Log Saved" : "Commit Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px] hover:shadow-md transition-all duration-300">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-[#004AAD]" /> Input Logs
              </h3>
              <button
                onClick={() => setRawInput("")}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Task 9:00 - 11:30..."
              className="w-full h-full p-6 text-sm font-mono border-none focus:ring-0 resize-none text-slate-600 leading-relaxed bg-slate-50/10 placeholder:text-slate-300"
            />
          </div>

          <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-6 space-y-3 hover:shadow-md transition-all duration-300">
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={16} className="text-[#004AAD]" /> Reflections
            </h3>
            <textarea
              value={keyLearnings}
              onChange={(e) => setKeyLearnings(e.target.value)}
              placeholder="Daily takeaways..."
              className="w-full h-24 p-4 text-sm font-medium border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-[#004AAD] resize-none bg-slate-50/50"
            />
          </div>
        </div>

        <div className="lg:col-span-8 bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden h-[540px] flex flex-col hover:shadow-md transition-all duration-300">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" /> Review Table
            </h3>
          </div>

          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 sticky top-0 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {tasks.map((task, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50/50 transition-all duration-200">
                    <td className="px-6 py-4">
                      <select
                        value={task.projectName}
                        onChange={(e) => handleUpdateTask(idx, "projectName", e.target.value)}
                        className="block w-full text-xs font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-[#004AAD] shadow-sm hover:border-[#004AAD] transition-colors cursor-pointer focus:ring-2 focus:ring-blue-100"
                      >
                        {projects.map((p: any, pi: number) => (
                          <option key={pi} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={task.description}
                        onChange={(e) => handleUpdateTask(idx, "description", e.target.value)}
                        className="w-full bg-transparent border-none p-0 font-semibold text-slate-800 text-sm focus:ring-0 group-hover:text-[#004AAD] transition-colors"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-[#004AAD] bg-blue-50 px-3 py-1 rounded-lg shadow-sm">
                        {Number(task.time || 0).toFixed(2)}h
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}