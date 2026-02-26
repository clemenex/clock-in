"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { LogRow, Project } from "@/types/clockin";

const INTERNAL_PROJECT: Project = { name: "Internal", link: "N/A", color: "#64748b" };

export function useClockInData(supabase: SupabaseClient | null, user: any) {
  const [projects, setProjects] = useState<Project[]>([INTERNAL_PROJECT]);
  const [allLogs, setAllLogs] = useState<LogRow[]>([]);

  const refreshProjects = useCallback(async () => {
    if (!supabase || !user?.id) return;
    const { data } = await supabase.from("projects").select("*").eq("user_id", user.id);
    if (data && data.length > 0) setProjects(data as Project[]);
  }, [supabase, user?.id]);

  const refreshLogs = useCallback(async () => {
    if (!supabase || !user?.id) return;
    const { data } = await supabase.from("logs").select("*").eq("user_id", user.id);
    if (data) setAllLogs(data as LogRow[]);
  }, [supabase, user?.id]);

  useEffect(() => {
    if (!supabase || !user?.id) return;

    refreshProjects();
    refreshLogs();

    const logChannel = supabase
      .channel("logs-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "logs", filter: `user_id=eq.${user.id}` }, refreshLogs)
      .subscribe();

    return () => {
      supabase.removeChannel(logChannel);
    };
  }, [supabase, user?.id, refreshProjects, refreshLogs]);

  return { projects, setProjects, allLogs, setAllLogs, refreshProjects, refreshLogs };
}