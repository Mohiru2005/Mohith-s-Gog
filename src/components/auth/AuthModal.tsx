"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Cpu, X, LogIn, UserPlus, User, KeyRound, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
}

export function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const res = login(username, password);
    if (!res.success) {
      setErrorMsg(res.error || "Sign in failed.");
    } else {
      setUsername("");
      setPassword("");
      onClose();
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const res = signup(username, password);
    if (!res.success) {
      setErrorMsg(res.error || "Account registration failed.");
    } else {
      setUsername("");
      setPassword("");
      onClose();
    }
  };

  const switchTab = (newTab: "login" | "signup") => {
    setTab(newTab);
    setErrorMsg("");
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 select-none animate-in fade-in">
      <div className="bg-[#090D1F] border-2 border-cyan-500/50 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-[0_0_50px_rgba(56,189,248,0.25)] relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <Cpu className="w-3.5 h-3.5" />
            <span>QUANTUM SECURITY PORTAL</span>
          </div>

          <h2 className="text-2xl font-display font-black text-white tracking-wide">
            {tab === "login" ? "COMMANDER LOGIN" : "CREATE ACCOUNT"}
          </h2>
          <p className="text-xs text-slate-400">
            {tab === "login"
              ? "Enter your registered Username & Password to sign in."
              : "Register a new Username & Password to create an account."}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 gap-1 bg-[#050814] p-1 rounded-xl border border-cyan-900/60 text-xs font-bold">
          <button
            onClick={() => switchTab("login")}
            className={`py-2 rounded-lg flex items-center justify-center space-x-2 transition ${
              tab === "login" ? "bg-cyan-500 text-slate-950 font-black shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => switchTab("signup")}
            className={`py-2 rounded-lg flex items-center justify-center space-x-2 transition ${
              tab === "signup" ? "bg-cyan-500 text-slate-950 font-black shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold p-3 rounded-xl flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Forms */}
        {tab === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-cyan-300 block mb-1">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#050814] border border-cyan-900/60 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-cyan-300 block mb-1">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#050814] border border-cyan-900/60 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-slate-950 font-black py-3 rounded-xl text-xs transition shadow-[0_0_20px_rgba(56,189,248,0.3)]"
            >
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-cyan-300 block mb-1">Choose Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Choose Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#050814] border border-cyan-900/60 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-cyan-300 block mb-1">Choose Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Choose Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#050814] border border-cyan-900/60 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-slate-950 font-black py-3 rounded-xl text-xs transition shadow-[0_0_20px_rgba(56,189,248,0.3)]"
            >
              Create Account & Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
