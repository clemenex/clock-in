"use client";

import { useEffect, useState, useCallback } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

type AuthArgs = { email: string; password: string; isSignUp: boolean };

export function useAuth(supabase: SupabaseClient | null) {
  const [user, setUser] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    let cancelled = false;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      setUser(data?.session?.user ?? null);
    })();

    const { data: auth } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      cancelled = true;
      auth?.subscription?.unsubscribe();
    };
  }, [supabase]);

  const authWithEmail = useCallback(
    async ({ email, password, isSignUp }: AuthArgs) => {
      if (!supabase) {
        setAuthError("Configuration missing. Please set your .env.local variables and restart the dev server.");
        return;
      }

      setAuthLoading(true);
      setAuthError(null);

      try {
        if (isSignUp) {
          const { error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;
        } else {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
        }
      } catch (err: any) {
        setAuthError(err?.message || "Authentication failed.");
      } finally {
        setAuthLoading(false);
      }
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  }, [supabase]);

  const enterDemoMode = useCallback(() => {
    if (!supabase) setUser({ email: "demo@preview.app", id: "demo-123" });
  }, [supabase]);

  return { user, authError, authLoading, setAuthError, authWithEmail, signOut, enterDemoMode };
}