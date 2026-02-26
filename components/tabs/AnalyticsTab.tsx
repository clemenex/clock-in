"use client";

import React from "react";
import { History, Search, ArrowLeft, FileBadge, Sparkles, Download } from "lucide-react";

type Props = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filteredLogs: any[];
  selectedSession: any;
  setSelectedSession: (v: any) => void;

  reportRange: { start: string; end: string };
  setReportRange: (v: { start: string; end: string }) => void;
  generateReportData: any[];
  exportToDOCX: () => void;
};

export function AnalyticsTab({
  searchQuery,
  setSearchQuery,
  filteredLogs,
  selectedSession,
  setSelectedSession,
  reportRange,
  setReportRange,
  generateReportData,
  exportToDOCX,
}: Props) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6 md:h-[700px] flex flex-col">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden hover:shadow-md transition-all duration-300">
            <header className="mb-6">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-3">
                <History size={18} className="text-[#004AAD]" /> Session History
              </h3>
            </header>

            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-100 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {filteredLogs.map((log: any, i: number) => (
                <div
                  key={i}
                  onClick={() => setSelectedSession(log)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all flex items-center justify-between group hover:-translate-x-1 duration-200 ${
                    selectedSession?.date === log.date
                      ? "bg-[#004AAD] border-[#004AAD] text-white shadow-lg"
                      : "bg-white border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm transition-colors ${
                        selectedSession?.date === log.date ? "bg-white/20 text-white" : "bg-slate-100 text-[#004AAD]"
                      }`}
                    >
                      {new Date(log.date).getDate()}
                    </div>
                    <div>
                      <p
                        className={`text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                          selectedSession?.date === log.date ? "text-blue-200" : "text-slate-500"
                        }`}
                      >
                        {new Date(log.date).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                      </p>
                      <p
                        className={`text-sm font-semibold transition-colors ${
                          selectedSession?.date === log.date ? "text-white" : "text-slate-800"
                        }`}
                      >
                        {(log.tasks?.length || 0)} Activities
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-bold transition-colors ${
                      selectedSession?.date === log.date ? "text-white" : "text-[#004AAD]"
                    }`}
                  >
                    {Number(log.total_hours || log.totalHours || 0).toFixed(1)}h
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {selectedSession ? (
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm animate-in zoom-in-95 duration-200 hover:shadow-md transition-all duration-300">
              <button
                onClick={() => setSelectedSession(null)}
                className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-[#004AAD] group transition-all"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back
              </button>

              <header className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                  {new Date(selectedSession.date).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h2>
                <p className="text-[#004AAD] font-semibold text-sm mt-1">
                  {Number(selectedSession.total_hours || selectedSession.totalHours || 0).toFixed(2)} Logged Hours
                </p>
              </header>

              <div className="space-y-6">
                <div className="space-y-3">
                  {(selectedSession.tasks || []).map((t: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center hover:bg-slate-100 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{t.description}</p>
                        <p className="text-[11px] font-medium text-slate-500 uppercase">{t.projectName}</p>
                      </div>
                      <span className="text-sm font-bold text-[#004AAD]">{Number(t.time || 0).toFixed(1)}h</span>
                    </div>
                  ))}
                </div>

                {selectedSession.key_learnings && (
                  <div className="space-y-3 pt-6 border-t border-slate-100">
                    <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Reflections</h4>
                    <p className="text-sm font-medium text-slate-600 italic leading-relaxed border-l-4 border-blue-100 pl-4 py-1">
                      "{selectedSession.key_learnings}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8 hover:shadow-md transition-all duration-300">
              <header>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <FileBadge size={22} className="text-[#004AAD]" /> Reporting Suite
                </h2>
                <p className="text-slate-500 font-medium text-sm mt-1">Generate and export professional monthly reports.</p>
              </header>

              <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block px-1">
                    Start
                  </label>
                  <input
                    type="date"
                    value={reportRange.start}
                    onChange={(e) => setReportRange({ ...reportRange, start: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium shadow-sm transition-all focus:ring-2 focus:ring-blue-100 focus:border-[#004AAD]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block px-1">
                    End
                  </label>
                  <input
                    type="date"
                    value={reportRange.end}
                    onChange={(e) => setReportRange({ ...reportRange, end: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium shadow-sm transition-all focus:ring-2 focus:ring-blue-100 focus:border-[#004AAD]"
                  />
                </div>
              </div>

              {generateReportData.length > 0 ? (
                <div className="space-y-6">
                  <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-inner max-h-[300px]">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-slate-500 uppercase">Date</th>
                          <th className="px-4 py-3 font-semibold text-slate-500 uppercase">Summary</th>
                          <th className="px-4 py-3 font-semibold text-slate-500 uppercase">Learnings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {generateReportData.map((row: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-4 font-bold text-slate-900 align-top">{row.date}</td>
                            <td className="px-4 py-4 text-slate-600 font-medium leading-relaxed align-top">
                              {row.activity}
                            </td>
                            <td className="px-4 py-4 text-slate-500 italic leading-relaxed align-top">{row.learnings}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={exportToDOCX}
                    className="w-full bg-[#004AAD] text-white py-4 rounded-2xl text-sm font-semibold shadow-xl shadow-blue-100 hover:bg-[#003A8A] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <Download size={20} strokeWidth={2.5} /> Export Report (.docx)
                  </button>
                </div>
              ) : (
                <div className="py-20 text-center text-slate-400 bg-slate-50/20 rounded-[1.5rem] border border-dashed border-slate-200">
                  <Sparkles size={40} className="mx-auto mb-4 opacity-30 animate-pulse" />
                  <p className="text-xs font-semibold uppercase tracking-wider">Select Range for Preview</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}