import type { LogRow, Project, Metrics } from "@/types/clockin";
import { getTodayISO, startOfWeekDate } from "@/lib/utils/dates";

export function computeMetrics(allLogs: LogRow[], projects: Project[], weeklyGoal: number): Metrics | null {
  if (!allLogs.length) return null;

  const totalHoursAll = allLogs.reduce((s, l) => s + (l.total_hours || 0), 0);
  const projMap: Record<string, number> = {};
  const meetingKeywords = ["meeting", "dsm", "sync", "call", "alignment", "daily"];
  let meetingHours = 0;
  let totalTaskCount = 0;
  let longestActivity = { description: "N/A", time: 0 };

  const startOfWeek = startOfWeekDate(new Date());
  const weekLogs = allLogs.filter((l) => new Date(l.date) >= startOfWeek);
  const weeklyTotal = weekLogs.reduce((s, l) => s + (l.total_hours || 0), 0);

  allLogs.forEach((l) => {
    (l.tasks || []).forEach((t) => {
      totalTaskCount++;
      projMap[t.projectName] = (projMap[t.projectName] || 0) + (t.time || 0);
      if (meetingKeywords.some((k) => (t.description || "").toLowerCase().includes(k))) {
        meetingHours += t.time || 0;
      }
    });
  });

  weekLogs.forEach((l) =>
    (l.tasks || []).forEach((t) => {
      if ((t.time || 0) > longestActivity.time) longestActivity = { description: t.description, time: t.time };
    })
  );

  const projectStats = Object.entries(projMap)
    .map(([name, hours]) => ({
      name,
      hours,
      percent: (hours / (totalHoursAll || 1)) * 100,
      color: projects.find((p) => p.name === name)?.color || "#64748b",
    }))
    .sort((a, b) => b.hours - a.hours);

  const last7: Metrics["last7"] = [];
  const chartDate = new Date();
  const todayISO = getTodayISO();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(chartDate);
    d.setDate(chartDate.getDate() - i);
    const ds = d.toISOString().split("T")[0];
    const log = allLogs.find((l) => l.date === ds);

    last7.push({
      day: d.toLocaleDateString(undefined, { weekday: "short" }),
      hours: log?.total_hours || 0,
      isToday: ds === todayISO,
    });
  }

  return {
    totalHoursAll,
    weeklyTotal,
    projectStats,
    last7,
    totalEntries: allLogs.length,
    meetingRatio: (meetingHours / (totalHoursAll || 1)) * 100,
    avgTaskDuration: totalHoursAll / (totalTaskCount || 1),
    longestActivity,
  };
}