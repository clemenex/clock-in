"use client";

import React from "react";
import { Briefcase, Plus, Trash2 } from "lucide-react";

type Props = {
  projects: any[];
  newProject: any;
  setNewProject: (v: any) => void;
  addProject: () => void;
  deleteProject: (name: string) => void;
};

export function ProjectsTab({ projects, newProject, setNewProject, addProject, deleteProject }: Props) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white p-8 sm:p-12 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-4 mb-12">
          <div className="bg-blue-50 p-3 rounded-2xl text-[#004AAD] transition-transform hover:scale-105 duration-300">
            <Briefcase size={24} strokeWidth={2.5} />
          </div>
          Project Registry
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12 bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-100 group shadow-inner">
          <input
            type="text"
            placeholder="Title"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium transition-all focus:ring-2 focus:ring-blue-100 focus:border-[#004AAD] shadow-sm"
          />
          <input
            type="text"
            placeholder="URL"
            value={newProject.link}
            onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
            className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium transition-all focus:ring-2 focus:ring-blue-100 focus:border-[#004AAD] shadow-sm"
          />
          <div className="flex gap-2">
            <input
              type="color"
              value={newProject.color}
              onChange={(e) => setNewProject({ ...newProject, color: e.target.value })}
              className="h-[46px] w-full p-1 rounded-xl border border-slate-200 bg-white cursor-pointer hover:shadow-md transition-shadow"
              title="Branding Color"
            />
            <button
              onClick={addProject}
              className="bg-[#004AAD] text-white px-8 rounded-xl shadow-md hover:bg-[#003A8A] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <Plus size={20} strokeWidth={3} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((proj: any, idx: number) => (
            <div
              key={idx}
              className="group p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4"
              style={{ borderLeftColor: proj.color }}
            >
              <div className="flex gap-4 items-center min-w-0">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: proj.color }}
                >
                  <Briefcase size={20} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{proj.name}</p>
                  <p className="text-[11px] text-slate-500 font-semibold truncate max-w-[140px] uppercase mt-0.5 tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity">
                    {proj.link}
                  </p>
                </div>
              </div>

              {proj.name !== "Internal" && (
                <button
                  onClick={() => deleteProject(proj.name)}
                  className="text-slate-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}