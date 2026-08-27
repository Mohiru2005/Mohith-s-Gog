"use client";

import React, { useState, useEffect } from "react";
import { useAuth, getRegisteredAccounts, RegisteredAccount } from "@/lib/auth-context";
import { ShieldAlert, Trash2, Users, Check, RefreshCw, Cpu } from "lucide-react";

export function AdminPanel() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Record<string, RegisteredAccount>>({});
  const [deletedMsg, setDeletedMsg] = useState<string | null>(null);

  const isAdmin = user?.username.toLowerCase() === "admin";

  const refreshAccounts = () => {
    setAccounts(getRegisteredAccounts());
  };

  useEffect(() => {
    refreshAccounts();
  }, []);

  if (!isAdmin) return null;

  const handleDeleteUser = (usernameKey: string, displayName: string) => {
    const current = getRegisteredAccounts();
    delete current[usernameKey];

    if (typeof window !== "undefined") {
      localStorage.setItem("gog_registered_accounts_v1", JSON.stringify(current));
    }

    setAccounts(current);
    setDeletedMsg(`Deleted user "${displayName}" from system.`);
    setTimeout(() => setDeletedMsg(null), 3000);
  };

  const accountList = Object.entries(accounts);

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#090D1F] border-2 border-fuchsia-500/50 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(217,70,239,0.2)] space-y-6 select-none animate-in fade-in">
      <div className="flex items-center justify-between border-b border-fuchsia-900/60 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 shadow-lg">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wider">SYSTEM ADMIN CONTROL PANEL</h2>
            <p className="text-xs text-fuchsia-400/80">Manage registered commander accounts & system users</p>
          </div>
        </div>

        <button
          onClick={refreshAccounts}
          className="flex items-center space-x-1.5 bg-[#050814] hover:bg-slate-900 text-slate-300 border border-fuchsia-500/30 font-bold px-3 py-1.5 rounded-xl text-xs transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-fuchsia-400" />
          <span>Refresh</span>
        </button>
      </div>

      {deletedMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold p-3 rounded-xl flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>{deletedMsg}</span>
        </div>
      )}

      {/* Registered Users Table */}
      <div className="bg-[#050814] border border-cyan-900/60 rounded-2xl p-4 shadow-inner">
        <div className="flex items-center justify-between border-b border-cyan-900/40 pb-2 mb-3">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Registered Accounts ({accountList.length})
            </h3>
          </div>
        </div>

        {accountList.length === 0 ? (
          <p className="text-xs text-slate-500 italic text-center py-4">No registered user accounts found</p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {accountList.map(([key, acc]) => (
              <div
                key={key}
                className="flex items-center justify-between bg-[#090D1F] p-3 rounded-xl border border-cyan-900/50 hover:border-fuchsia-500/40 transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-xs text-cyan-300">
                    👤
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{acc.username}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Registered: {new Date(acc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteUser(key, acc.username)}
                  className="flex items-center space-x-1 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                  title="Delete user account"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete User</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
