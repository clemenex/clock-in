import type { LogRow, ReportRow } from "@/types/clockin";

export function buildReportRows(allLogs: LogRow[], start: string, end: string): ReportRow[] {
  if (!start || !end) return [];

  return allLogs
    .filter((l) => l.date >= start && l.date <= end)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((log) => ({
      date: new Date(log.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      activity: (log.tasks || []).map((t) => t.description).join(" + "),
      learnings: log.key_learnings || "Continued task progression.",
      totalHours: log.total_hours,
    }));
}