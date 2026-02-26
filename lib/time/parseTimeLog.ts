import type { TaskRow } from "@/types/clockin";

type Options = {
  defaultProjectName?: string;
  defaultTaskLink?: string;
};

export function parseTimeLog(rawInput: string, opts: Options = {}) {
  const defaultProjectName = opts.defaultProjectName ?? "Internal";
  const defaultTaskLink = opts.defaultTaskLink ?? "N/A";

  const parseTime = (s: string) => {
    const parts = s.trim().split(":");
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1] || "0", 10);
    return { h, m };
  };

  const to24 = (h: number, isEnd: boolean, startH?: number) => {
    if (h === 12) return 12;
    if (h < 8) return h + 12;
    if (isEnd && startH && h < startH) return h + 12;
    return h;
  };

  const lines = rawInput.split("\n").filter((l) => l.trim() !== "");
  const rawTasks: { name: string; duration: number }[] = [];

  lines.forEach((line) => {
    const match = line.match(/(.+)\s+(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
    if (!match) return;

    const name = match[1].trim();
    const s = parseTime(match[2]);
    const e = parseTime(match[3]);
    const s24 = to24(s.h, false);
    const e24 = to24(e.h, true, s.h);
    const duration = ((e24 * 60 + e.m) - (s24 * 60 + s.m)) / 60;

    rawTasks.push({ name, duration: Math.max(0, duration) });
  });

  const grouped = rawTasks.reduce((acc: TaskRow[], curr) => {
    const existing = acc.find((t) => t.description === curr.name);
    if (existing) existing.time += curr.duration;
    else {
      acc.push({
        projectName: defaultProjectName,
        taskLink: defaultTaskLink,
        description: curr.name,
        time: curr.duration,
      });
    }
    return acc;
  }, []);

  const totalHours = grouped.reduce((sum, t) => sum + (Number(t.time) || 0), 0);

  return { tasks: grouped, totalHours };
}