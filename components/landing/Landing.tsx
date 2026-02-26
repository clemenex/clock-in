"use client";

import React from "react";
import { Clock, AlertCircle, UserPlus, LogIn } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="z-10 w-full max-w-md px-6 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <div
            onClick={onDemo}
            className="bg-[#004AAD] p-6 rounded-[2.5rem] text-white shadow-2xl inline-block mb-6 transition-transform hover:scale-105 cursor-pointer"
          >
            <Clock size={56} strokeWidth={2.5} />
          </div>
          <h1 className="text-5xl font-bold tracking-tighter text-[#004AAD]">cLock In</h1>
          <p className="text-slate-400 font-semibold text-sm uppercase tracking-[0.3em] mt-2 text-balance leading-relaxed">
            Internship Productivity Intelligence
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#004AAD]"></div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#004AAD] transition-all text-sm font-medium"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                Secure Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#004AAD] transition-all text-sm font-medium"
                placeholder="••••••••"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-50 rounded-xl flex items-center gap-3 text-red-600 text-xs font-semibold border border-red-100">
                <AlertCircle size={14} /> {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[#004AAD] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-[#003A8A] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {authLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : isSignUp ? (
                <>
                  <UserPlus size={18} /> Create Account
                </>
              ) : (
                <>
                  <LogIn size={18} /> Enter Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-medium">
              {isSignUp ? "Already have an account?" : "New to cLock In?"}{" "}
              <button
                onClick={() => {
                  toggleMode();
                  clearError();
                }}
                className="text-[#004AAD] font-bold hover:underline"
              >
                {isSignUp ? "Sign In" : "Register Now"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}