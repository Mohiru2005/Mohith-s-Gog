"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth/AuthModal";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { Swords, Shield, LogIn, UserPlus, ArrowRight, Cpu, Zap, ShieldAlert } from "lucide-react";

export default function WelcomePage() {
  const { user } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  const openAuth = (tab: "login" | "signup") => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  const isAdmin = user?.username.toLowerCase() === "admin";

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-10 py-6 select-none">
      {/* Quantum Cyber Hero Card */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-[#090D1F]/90 border border-cyan-500/40 p-8 md:p-14 shadow-[0_0_50px_rgba(56,189,248,0.15)] text-center space-y-6">
        {/* Ambient Glowing Neon Orbs */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 right-10 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.2)]">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>QUANTUM CYBER STRATEGY MATRIX v3.0</span>
        </div>

        {/* Brand Title */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-wider">
            <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">MOHIRU'S</span>{" "}
            <span className="text-white">GOG</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed pt-2">
            The next-generation Games of the Generals strategy engine — deploy 21 tactical pieces, outsmart rival commanders, and dominate remote cyber matches.
          </p>
        </div>

        {/* Authenticated User Status vs Login/Signup Portal */}
        {user ? (
          <div className="bg-[#050814] border border-cyan-500/40 rounded-2xl p-6 max-w-lg mx-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-cyan-900/60 pb-3">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl text-cyan-300">
                  {user.avatar}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">{user.username}</h3>
                  <p className="text-xs text-cyan-400 font-bold">
                    {isAdmin ? "System Administrator" : "Commander Active"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/online"
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-slate-950 font-black text-sm px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.4)] transition transform hover:scale-105"
              >
                <Swords className="w-4 h-4" />
                <span>Enter Cyber Match</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/setup"
                className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-white font-bold text-sm px-5 py-3 rounded-xl transition"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Arsenal Grid</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 max-w-md mx-auto">
            <button
              onClick={() => openAuth("login")}
              className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-slate-950 font-black text-sm px-6 py-3.5 rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.4)] transition transform hover:scale-105"
            >
              <LogIn className="w-4 h-4" />
              <span>Commander Sign In</span>
            </button>

            <button
              onClick={() => openAuth("signup")}
              className="flex-1 flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition"
            >
              <UserPlus className="w-4 h-4 text-cyan-400" />
              <span>Create Account</span>
            </button>
          </div>
        )}
      </div>

      {/* Admin Control Panel (Visible only when logged in as admin/admin) */}
      {isAdmin && <AdminPanel />}

      {/* Quantum Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <div className="bg-[#090D1F]/90 border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-3 hover:border-cyan-400 transition">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Swords className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Quantum Matchmaking</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Host or join remote 2-player game rooms across devices using instant 4-digit Room Codes.
          </p>
        </div>

        <div className="bg-[#090D1F]/90 border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-3 hover:border-fuchsia-400 transition">
          <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Tactical Arsenal</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Save and load multiple custom 21-piece military army loadouts directly into your matches.
          </p>
        </div>

        <div className="bg-[#090D1F]/90 border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-3 hover:border-amber-400 transition">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Stealth Fog of War</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Opponent unit ranks are completely hidden as mystery cyber cards until secret battle arbitration!
          </p>
        </div>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultTab={authTab} />
    </div>
  );
}
