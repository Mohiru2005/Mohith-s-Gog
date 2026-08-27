"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "./AuthModal";
import { ShieldAlert, LogIn, UserPlus, Cpu } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  const openAuth = (tab: "login" | "signup") => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 py-10 select-none text-center">
        <div className="bg-[#090D1F]/90 border border-cyan-500/40 rounded-3xl p-8 md:p-12 max-w-lg w-full shadow-[0_0_40px_rgba(56,189,248,0.15)] space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto shadow-lg">
            <Cpu className="w-8 h-8 animate-pulse text-cyan-300" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">QUANTUM AUTHENTICATION REQUIRED</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Access to cyber matches, tactical arsenals, and custom loadouts is restricted to authenticated commanders.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => openAuth("login")}
              className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-slate-950 font-black py-3 rounded-xl text-xs transition shadow-lg"
            >
              <LogIn className="w-4 h-4" />
              <span>Commander Sign In</span>
            </button>

            <button
              onClick={() => openAuth("signup")}
              className="flex-1 flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-white font-bold py-3 rounded-xl text-xs transition"
            >
              <UserPlus className="w-4 h-4 text-cyan-400" />
              <span>Register Account</span>
            </button>
          </div>
        </div>

        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultTab={authTab} />
      </div>
    );
  }

  return <>{children}</>;
}
