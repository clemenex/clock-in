"use client";

import React from "react";
import { Clock, AlertCircle, UserPlus, LogIn } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

type Props = {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  isSignUp: boolean;
  toggleMode: () => void;
  authError: string | null;
  authLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onDemo: () => void;
  clearError: () => void;
};

export function Landing({
  email,
  setEmail,
  password,
  setPassword,
  isSignUp,
  toggleMode,
  authError,
  authLoading,
  onSubmit,
  onDemo,
  clearError,
}: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-appbg relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="z-10 w-full max-w-md px-6 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <button
            type="button"
            onClick={onDemo}
            className="bg-brand p-6 rounded-[2.5rem] text-white shadow-2xl inline-flex items-center justify-center mb-6 transition-transform hover:scale-105"
            title="Enter Demo Mode"
          >
            <Clock size={56} strokeWidth={2.5} />
          </button>

          <h1 className="text-5xl font-bold tracking-tighter text-brand">cLock In</h1>
          <p className="text-slate-400 font-semibold text-sm uppercase tracking-[0.3em] mt-2 text-balance leading-relaxed">
            Internship Productivity Intelligence
          </p>
        </div>

        <Card className="p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-brand" />

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label>Work Email</Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Secure Password</Label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-50 rounded-xl flex items-center gap-3 text-red-600 text-xs font-semibold border border-red-100">
                <AlertCircle size={14} /> {authError}
              </div>
            )}

            <Button type="submit" size="lg" disabled={authLoading} className="w-full">
              {authLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isSignUp ? (
                <>
                  <UserPlus size={18} /> Create Account
                </>
              ) : (
                <>
                  <LogIn size={18} /> Enter Dashboard
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-medium">
              {isSignUp ? "Already have an account?" : "New to cLock In?"}{" "}
              <button
                type="button"
                onClick={() => {
                  toggleMode();
                  clearError();
                }}
                className="text-brand font-bold hover:underline"
              >
                {isSignUp ? "Sign In" : "Register Now"}
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}