"use client";

import "./globals.css";
import React, { useState } from "react";
import Link from "next/link";
import { Cpu, Swords, Shield, LogIn, LogOut, Radio } from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth/AuthModal";

function HeaderNav() {
  const { user, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  const openLogin = () => {
    setAuthTab("login");
    setIsAuthOpen(true);
  };

  const openSignup = () => {
    setAuthTab("signup");
    setIsAuthOpen(true);
  };

  return (
    <>
      <header className="sticky top-3 z-50 transition-all duration-300 max-w-7xl mx-auto w-full px-4 select-none">
        <div className="bg-[#090D1F]/90 backdrop-blur-xl border border-cyan-500/40 rounded-2xl px-5 py-3.5 shadow-[0_0_30px_rgba(56,189,248,0.15)] flex items-center justify-between">
          {/* Custom Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition shadow-[0_0_20px_rgba(56,189,248,0.4)]">
              <Cpu className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700 text-cyan-300" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-black bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent tracking-wider uppercase">MOHIRU'S</span>
                <span className="text-xs font-black text-cyan-300 tracking-wider">GOG</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[9px] font-mono text-cyan-400/70 tracking-widest uppercase">QUANTUM MATRIX v3.0</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_10px_rgba(56,189,248,1)]" />
              </div>
            </div>
          </Link>

          {/* Center HUD Navigation */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-[#050814]/80 border border-cyan-900/60 rounded-xl p-1.5">
            <Link
              href="/"
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/50 transition"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Quantum Hub</span>
            </Link>

            <Link
              href="/online"
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-fuchsia-300 hover:bg-fuchsia-950/50 transition"
            >
              <Swords className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>Cyber Matches</span>
            </Link>

            <Link
              href="/setup"
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-emerald-300 hover:bg-emerald-950/50 transition"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Arsenal Grid</span>
            </Link>
          </nav>

          {/* Right User Bar */}
          <div className="flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-3 bg-[#050814] border border-cyan-500/40 rounded-xl px-3 py-1.5 shadow-md">
                <span className="text-xs font-black text-cyan-300">{user.username}</span>
                <button
                  onClick={logout}
                  className="text-slate-400 hover:text-red-400 p-1 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={openLogin}
                  className="flex items-center space-x-1.5 bg-slate-900/90 hover:bg-slate-800 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs border border-cyan-500/30 transition"
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={openSignup}
                  className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-slate-950 font-black px-4 py-1.5 rounded-xl text-xs transition shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                >
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultTab={authTab} />
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>Mohiru's GOG - Quantum Cyber Strategy</title>
      </head>
      <body className="min-h-screen bg-[#050814] text-slate-100 flex flex-col antialiased relative selection:bg-cyan-500/30">
        {/* Quantum Cyber Grid Overlay */}
        <div className="fixed inset-0 pointer-events-none select-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf80f_1px,transparent_1px),linear-gradient(to_bottom,#38bdf80f_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_80%,transparent_100%)]" />
          <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-cyan-500/15 via-fuchsia-500/5 to-transparent opacity-70" />
        </div>

        <AuthProvider>
          <HeaderNav />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 relative z-10">
            {children}
          </main>
        </AuthProvider>

        <footer className="w-full border-t border-cyan-900/40 py-4 text-center text-xs font-mono text-cyan-500/60 relative z-10">
          MOHIRU'S GOG • QUANTUM CYBER STRATEGY ENGINE
        </footer>
      </body>
    </html>
  );
}
