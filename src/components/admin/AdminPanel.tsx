"use client";

import React, { useState, useEffect } from "react";
import { useAuth, getRegisteredAccounts, RegisteredAccount } from "@/lib/auth-context";
import { Trash2, Users } from "lucide-react";

export function AdminPanel() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Record<string, RegisteredAccount>>({});

  const isAdmin = user?.username.toLowerCase() === "admin";

  const refreshAccounts = () => {
    setAccounts(getRegisteredAccounts());
  };

  useEffect(() => {
    refreshAccounts();
  }, []);

  if (!isAdmin) return null;

  const handleDeleteUser = (usernameKey: string) => {
    const current = getRegisteredAccounts();
    delete current[usernameKey];

    if (typeof window !== "undefined") {
      localStorage.setItem("gog_registered_accounts_v1", JSON.stringify(current));
    }

    setAccounts(current);
  };

  const accountList = Object.entries(accounts);

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#090D1F] border border-cyan-500/40 rounded-2xl p-6 shadow-xl space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-cyan-900/60 pb-3">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-black text-white">Registered Users ({accountList.length})</h3>
        </div>
      </div>

      {accountList.length === 0 ? (
        <p className="text-xs text-slate-500 italic text-center py-4">No registered users</p>
      ) : (
        <div className="space-y-2">
          {accountList.map(([key, acc]) => (
            <div
              key={key}
              className="flex items-center justify-between bg-[#050814] p-3 rounded-xl border border-cyan-900/60"
            >
              <span className="text-xs font-bold text-white font-mono">{acc.username}</span>

              <button
                onClick={() => handleDeleteUser(key)}
                className="flex items-center space-x-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold px-3 py-1.5 rounded-lg text-xs transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
