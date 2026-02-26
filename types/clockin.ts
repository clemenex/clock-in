export type Project = {
  user_id?: string;
  name: string;
  link: string;
  color: string;
};

export type TaskRow = {
  projectName: string;
  taskLink: string;
  description: string;
  time: number;
};

export type LogRow = {
  user_id: string;
  date: string; // YYYY-MM-DD
  tasks: TaskRow[];
  total_hours: number;
  key_learnings?: string | null;
  updated_at?: string;
};

export type Metrics = {
  totalHoursAll: number;
  weeklyTotal: number;
  projectStats: { name: string; hours: number; percent: number; color: string }[];
  last7: { day: string; hours: number; isToday: boolean }[];
  totalEntries: number;
  meetingRatio: number;
  avgTaskDuration: number;
  longestActivity: { description: string; time: number };
};

export type ReportRow = {
  date: string;
  activity: string;
  learnings: string;
  totalHours: number;
};