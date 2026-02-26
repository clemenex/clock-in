"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  headline: string | null;
  website: string | null;
  updated_at?: string | null;
};

function getExt(filename: string) {
  const parts = filename.split(".");
  return (parts.length > 1 ? parts.pop() : "png")!.toLowerCase();
}

export function useProfile(supabase: SupabaseClient | null, user: any) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    if (!supabase || !user?.id) return;

    setLoadingProfile(true);
    setProfileError(null);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const seed: Profile = {
          id: user.id,
          full_name: user?.user_metadata?.full_name ?? null,
          avatar_url: user?.user_metadata?.avatar_url ?? null,
          headline: null,
          website: null,
          updated_at: new Date().toISOString(),
        };

        const { error: upsertErr } = await supabase
          .from("profiles")
          .upsert(seed, { onConflict: "id" });

        if (upsertErr) throw upsertErr;
        setProfile(seed);
        return;
      }

      setProfile(data as Profile);
    } catch (e: any) {
      setProfileError(e?.message || "Failed to load profile.");
    } finally {
      setLoadingProfile(false);
    }
  }, [supabase, user?.id]);

  useEffect(() => {
    if (!user?.id) {
      setProfile(null);
      setProfileError(null);
      setLoadingProfile(false);
      return;
    }
    refreshProfile();
  }, [user?.id, refreshProfile]);

  const saveProfile = useCallback(
    async (draft: Omit<Profile, "id">) => {
      if (!supabase || !user?.id) return { ok: false, error: "Not signed in." as string };

      setProfileError(null);
      const payload: Profile = {
        id: user.id,
        ...draft,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
      if (error) {
        setProfileError(error.message);
        return { ok: false, error: error.message };
      }

      await supabase.auth.updateUser({
        data: { full_name: draft.full_name, avatar_url: draft.avatar_url },
      });

      setProfile(payload);
      return { ok: true as const };
    },
    [supabase, user?.id]
  );

  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!supabase || !user?.id) return { ok: false, error: "Not signed in." as string };

      try {
        const ext = getExt(file.name);
        const path = `${user.id}/avatar-${Date.now()}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from("avatars")
          .upload(path, file, { upsert: true });

        if (uploadErr) throw uploadErr;

        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        const publicUrl = data.publicUrl;

        const current = profile ?? {
          id: user.id,
          full_name: null,
          avatar_url: null,
          headline: null,
          website: null,
        };

        const res = await saveProfile({
          full_name: current.full_name,
          avatar_url: publicUrl,
          headline: current.headline,
          website: current.website,
        });

        if (!res.ok) return { ok: false, error: "Failed to save avatar url." as string };
        return { ok: true as const, url: publicUrl };
      } catch (e: any) {
        const msg = e?.message || "Failed to upload avatar.";
        setProfileError(msg);
        return { ok: false, error: msg };
      }
    },
    [supabase, user?.id, profile, saveProfile]
  );

  return { profile, loadingProfile, profileError, refreshProfile, saveProfile, uploadAvatar };
}