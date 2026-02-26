"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

import { createBrowserSupabaseClient } from "../lib/supabase/client";
import { loadScript } from "../lib/utils/loadscript";
import { getTodayISO } from "../lib/utils/dates";
import { parseTimeLog } from "../lib/time/parseTimeLog";
import { computeMetrics } from "../lib/analytics/computeMetrics";
import { buildReportRows } from "../lib/analytics/report";

import { useAuth } from "../hooks/useAuth";
import { useClockInData } from "../hooks/useClockInData";

import { Landing } from "../components/landing/Landing";
import { AppShell } from "../components/layout/AppShell";
import { DashboardTab } from "../components/tabs/DashboardTab";
import { LogsTab } from "../components/tabs/LogsTab";
import { AnalyticsTab } from "../components/tabs/AnalyticsTab";
import { ProjectsTab } from "../components/tabs/ProjectsTab";

export default function App() {
  const supabase = useMemo(() => createBrowserSupabaseClient() as SupabaseClient | null, []);
  const { user, authError, authLoading, setAuthError, authWithEmail, signOut, enterDemoMode } = useAuth(supabase);
  const { projects, setProjects, allLogs } = useClockInData(supabase, user);

  const [activeTab, setActiveTab] = useState("landing");

  // Auth form
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Logs
  const [date, setDate] = useState(getTodayISO());
  const [rawInput, setRawInput] = useState("");
  const [keyLearnings, setKeyLearnings] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [saveStatus, setSaveStatus] = useState("idle");

  // Dashboard
  const [weeklyGoal] = useState(40);

  // Analytics
  const [searchQuery, setSearchQuery] = useState("");
  const [reportRange, setReportRange] = useState({ start: "", end: "" });
  const [selectedSession, setSelectedSession] = useState<any>(null);

  // Projects
  const [newProject, setNewProject] = useState({ name: "", link: "", color: "#004AAD" });

  // Load docx
  useEffect(() => {
    loadScript("https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.js", "docx-script").catch(() =>
      console.warn("Docx failed to load.")
    );
  }, []);

  // Auto route when user logs in/out
  useEffect(() => {
    if (!user) setActiveTab("landing");
    else if (activeTab === "landing") setActiveTab("dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Parse raw input into tasks
  useEffect(() => {
    if (!rawInput.trim()) return;
    const parsed = parseTimeLog(rawInput);
    setTasks(parsed.tasks);
    setTotalHours(parsed.totalHours);
  }, [rawInput]);

  // Hydrate tasks when switching date (only if not typing rawInput)
  useEffect(() => {
    if (!user || !allLogs.length) return;
    if (rawInput !== "") return;

    const currentLog = allLogs.find((l: any) => l.date === date);
    if (currentLog) {
      setTasks(currentLog.tasks || []);
      setTotalHours(currentLog.total_hours || 0);
      setKeyLearnings(currentLog.key_learnings || "");
    } else {
      setTasks([]);
      setTotalHours(0);
      setKeyLearnings("");
    }
  }, [date, allLogs, user, rawInput]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    await authWithEmail({ email, password, isSignUp });
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const enterDemo = () => {
    enterDemoMode();
    if (!supabase) setActiveTab("dashboard");
  };

  const onNewEntry = () => {
    setRawInput("");
    setDate(getTodayISO());
    setActiveTab("logs");
  };

  const saveDailyLog = async () => {
    if (!user || tasks.length === 0) return;

    if (!supabase) {
      alert("Running in Demo Mode: Data is not saved to the cloud.");
      return;
    }

    setSaveStatus("saving");
    try {
      const { error } = await supabase.from("logs").upsert(
        {
          user_id: user.id,
          date,
          tasks,
          total_hours: totalHours,
          key_learnings: keyLearnings,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,date" }
      );
      if (error) throw error;

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      console.error(err);
      setSaveStatus("idle");
    }
  };

  const handleUpdateTask = (index: number, field: string, value: string) => {
    const newTasks = [...tasks] as any[];
    newTasks[index][field] = value;

    if (field === "projectName") {
      const project = projects.find((p: any) => p.name === value);
      if (project) newTasks[index].taskLink = project.link;
    }

    setTasks(newTasks);
    if (field === "time") setTotalHours(newTasks.reduce((sum, t) => sum + Number(t.time || 0), 0));
  };

  const addProject = async () => {
    if (!user || !newProject.name.trim()) return;

    if (!supabase) {
      setProjects([...projects, { ...newProject, user_id: user.id }]);
      setNewProject({ name: "", link: "", color: "#004AAD" });
      return;
    }

    await supabase.from("projects").upsert({
      user_id: user.id,
      name: newProject.name,
      link: newProject.link,
      color: newProject.color,
    });

    setNewProject({ name: "", link: "", color: "#004AAD" });
  };

  const deleteProject = async (name: string) => {
    if (name === "Internal") return;

    // optimistic UI
    setProjects((prev: any[]) => prev.filter((p) => p.name !== name));

    if (supabase && user?.id) {
      await supabase.from("projects").delete().eq("user_id", user.id).eq("name", name);
    }
  };

  const metrics = useMemo(() => computeMetrics(allLogs as any, projects as any, weeklyGoal), [allLogs, projects, weeklyGoal]);

  const filteredLogs = useMemo(() => {
    const sorted = [...allLogs].sort((a: any, b: any) => b.date.localeCompare(a.date));
    if (!searchQuery.trim()) return sorted;
    const q = searchQuery.toLowerCase();
    return sorted.filter(
      (l: any) =>
        l.date.includes(q) ||
        new Date(l.date).toLocaleDateString(undefined, { month: "long" }).toLowerCase().includes(q)
    );
  }, [allLogs, searchQuery]);

  const generateReportData = useMemo(
    () => buildReportRows(allLogs as any, reportRange.start, reportRange.end),
    [allLogs, reportRange]
  );

  const exportToDOCX = async () => {
    const globalWindow = window as any;
    if (!globalWindow.docx) {
      alert("DOCX Export is unavailable. Please ensure you are connected to the internet to load the export engine.");
      return;
    }

    const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, TextRun } =
      globalWindow.docx;

    const rows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Date", bold: true })], alignment: AlignmentType.CENTER })],
            shading: { fill: "F3F4F6" },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Activity / Task", bold: true })], alignment: AlignmentType.CENTER })],
            shading: { fill: "F3F4F6" },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Key Learnings", bold: true })], alignment: AlignmentType.CENTER })],
            shading: { fill: "F3F4F6" },
          }),
        ],
      }),
      ...generateReportData.map(
        (item: any) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: item.date, alignment: AlignmentType.CENTER })] }),
              new TableCell({ children: [new Paragraph({ text: item.activity })] }),
              new TableCell({ children: [new Paragraph({ text: item.learnings })] }),
            ],
          })
      ),
    ];

    const table = new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } });

    const docObj = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: "MONTHLY PROGRESS REPORT", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
            new Paragraph({ text: `Period: ${reportRange.start} to ${reportRange.end}`, alignment: AlignmentType.CENTER }),
            new Paragraph({ text: "" }),
            table,
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(docObj);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Report_${reportRange.start}.docx`;
    link.click();
  };

  if (activeTab === "landing" && !user) {
    return (
      <Landing
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isSignUp={isSignUp}
        toggleMode={() => setIsSignUp((v) => !v)}
        authError={authError}
        authLoading={authLoading}
        onSubmit={handleAuth}
        onDemo={enterDemo}
        clearError={() => setAuthError(null)}
      />
    );
  }

  return (
    <AppShell user={user} activeTab={activeTab} setActiveTab={setActiveTab} onSignOut={handleSignOut}>
      {activeTab === "dashboard" && <DashboardTab metrics={metrics} weeklyGoal={weeklyGoal} onNewEntry={onNewEntry} />}

      {activeTab === "logs" && (
        <LogsTab
          date={date}
          setDate={setDate}
          saveDailyLog={saveDailyLog}
          saveStatus={saveStatus}
          rawInput={rawInput}
          setRawInput={setRawInput}
          keyLearnings={keyLearnings}
          setKeyLearnings={setKeyLearnings}
          tasks={tasks}
          projects={projects}
          handleUpdateTask={handleUpdateTask}
        />
      )}

      {activeTab === "analytics" && (
        <AnalyticsTab
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredLogs={filteredLogs}
          selectedSession={selectedSession}
          setSelectedSession={setSelectedSession}
          reportRange={reportRange}
          setReportRange={setReportRange}
          generateReportData={generateReportData}
          exportToDOCX={exportToDOCX}
        />
      )}

      {activeTab === "projects" && (
        <ProjectsTab
          projects={projects}
          newProject={newProject}
          setNewProject={setNewProject}
          addProject={addProject}
          deleteProject={deleteProject}
        />
      )}
    </AppShell>
  );
}