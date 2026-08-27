"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  id: string;
  username: string;
  avatar: string;
}

export interface RegisteredAccount {
  username: string;
  passwordHash: string;
  createdAt: number;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => { success: boolean; error?: string };
  signup: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AUTH_USER_KEY = "gog_auth_user_v1";
const ACCOUNTS_STORAGE_KEY = "gog_registered_accounts_v1";

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => ({ success: false }),
  signup: () => ({ success: false }),
  logout: () => {},
});

export function getRegisteredAccounts(): Record<string, RegisteredAccount> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  const signup = (username: string, password: string) => {
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      return { success: false, error: "Username and password are required!" };
    }

    const accounts = getRegisteredAccounts();
    const userKey = cleanUser.toLowerCase();

    if (accounts[userKey]) {
      return { success: false, error: "Account already exists! Please Sign In." };
    }

    // Register new account
    accounts[userKey] = {
      username: cleanUser,
      passwordHash: cleanPass,
      createdAt: Date.now(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    }

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      username: cleanUser,
      avatar: "🎖️",
    };

    setUser(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    }

    return { success: true };
  };

  const login = (username: string, password: string) => {
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      return { success: false, error: "Please enter your username and password." };
    }

    // Special Superuser Admin Account Check
    if (cleanUser.toLowerCase() === "admin" && cleanPass === "admin") {
      const adminUser: AuthUser = {
        id: "usr-admin-superuser",
        username: "admin",
        avatar: "👑",
      };
      setUser(adminUser);
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(adminUser));
      }
      return { success: true };
    }

    const accounts = getRegisteredAccounts();
    const userKey = cleanUser.toLowerCase();
    const account = accounts[userKey];

    if (!account) {
      return { success: false, error: "Account not found! Please Create an Account first." };
    }

    if (account.passwordHash !== cleanPass) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      username: account.username,
      avatar: "⭐",
    };

    setUser(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    }

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
