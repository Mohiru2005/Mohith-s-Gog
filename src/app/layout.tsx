"use client";

import "./globals.css";
import React from "react";
import Link from "next/link";
import { Cpu, Swords, Shield, Radio } from "lucide-react";
import { usePlayerSession } from "@/lib/game/player-session";

function HeaderNav() {
  const { name } = usePlayerSession();

  return (
    <header className="sticky top-3 z-50 transition-all duration-300 max-w-6xl mx-auto w-full px-4 select-none">
      <div className="bg-[#090D1F]/90 backdrop-blur-xl border border-cyan-500/40 rounded-2xl px-5 py-3 shadow-[0_0_30px_rgba(56,189,248,0.15)] flex items-center justify-between">
        {/* Custom Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition shadow-[0_0_20px_rgba(56,189,248,0.4)]">
            <Cpu className="w-5 h-5 text-cyan-300" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-black bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent tracking-wider uppercase">MOHIRU'S</span>
              <span className="text-xs font-black text-cyan-300 tracking-wider">GOG</span>
            </div>
            <span className="text-[9px] font-mono text-cyan-400/70 tracking-widest uppercase">QUANTUM MATRIX</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-2">
          <Link
            href="/"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/50 transition"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lobby</span>
          </Link>

          <Link
            href="/setup"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-emerald-300 hover:bg-emerald-950/50 transition"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Setup Grid</span>
          </Link>

          {name && (
            <div className="hidden sm:flex items-center space-x-1.5 bg-[#050814] border border-cyan-500/30 rounded-xl px-3 py-1 text-xs font-bold text-cyan-300">
              <span>👤 {name}</span>
            </div>
          )}
        </nav>
      </div>
    </header>
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

        <HeaderNav />
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 relative z-10">
          {children}
        </main>

        <footer className="w-full border-t border-cyan-900/40 py-4 text-center text-xs font-mono text-cyan-500/60 relative z-10">
          MOHIRU'S GOG • QUANTUM CYBER STRATEGY ENGINE
        </footer>
      </body>
    </html>
  );
}
