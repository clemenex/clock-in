"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Camera, Trash2 } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

type Props = {
  profile: any;
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onSave: (draft: { full_name: string | null; avatar_url: string | null; headline: string | null; website: string | null }) => Promise<{ ok: boolean; error?: string } | { ok: true }>;
  onUploadAvatar: (file: File) => Promise<any>;
};

export function ProfileTab({ profile, loading, error, onBack, onSave, onUploadAvatar }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const [fullName, setFullName] = useState<string>("");
  const [headline, setHeadline] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const initials = useMemo(() => {
    const s = (fullName || "").trim();
    if (!s) return "U";
    return s.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  }, [fullName]);

  useEffect(() => {
    setFullName(profile?.full_name || "");
    setHeadline(profile?.headline || "");
    setWebsite(profile?.website || "");
    setAvatarUrl(profile?.avatar_url || "");
  }, [profile]);

  const handlePickFile = () => fileRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setLocalError(null);
    const res = await onUploadAvatar(f);
    if (res?.ok && res?.url) setAvatarUrl(res.url);
    if (!res?.ok) setLocalError(res?.error || "Upload failed.");
    e.target.value = "";
  };

  const handleRemovePhoto = async () => {
    setAvatarUrl("");
  };

  const handleSave = async () => {
    setSaving(true);
    setLocalError(null);
    const res = await onSave({
      full_name: fullName.trim() || null,
      avatar_url: avatarUrl || null,
      headline: headline.trim() || null,
      website: website.trim() || null,
    });
    if (!("ok" in res) || !res.ok) setLocalError((res as any).error || "Save failed.");
    setSaving(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-[rgb(var(--brand))] transition-all"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <Card className="p-8">
        <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
          <div className="flex items-center gap-5">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[rgb(var(--brand))] font-extrabold text-xl">
                  {initials}
                </div>
              )}

              <button
                type="button"
                onClick={handlePickFile}
                className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-[rgb(var(--brand))] text-white flex items-center justify-center shadow-lg hover:bg-[rgb(var(--brand-strong))] transition-all"
                title="Upload photo"
              >
                <Camera size={16} />
              </button>

              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">Profile</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">Edit your name, photo, and details.</p>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition-all"
                >
                  <Trash2 size={14} /> Remove photo
                </button>
              )}
            </div>
          </div>

          <div className="w-full md:max-w-xs">
            <Button className="w-full" size="lg" disabled={saving || loading} onClick={handleSave}>
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>

        {(error || localError) && (
          <div className="mt-6 p-3 bg-red-50 rounded-xl text-red-600 text-xs font-semibold border border-red-100">
            {localError || error}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label>Full Name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Peter Dela Cruz" />
          </div>

          <div className="space-y-1.5">
            <Label>Headline</Label>
            <Input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g. Intern • Backend Engineer" />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label>Website / Portfolio</Label>
            <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
          </div>
        </div>
      </Card>
    </div>
  );
}