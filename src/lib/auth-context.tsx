"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  id: string;
  username: string;
  avatar: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string) => void;
  signup: (username: string) => void;
  logout: () => void;
}

const AUTH_STORAGE_KEY = "gog_auth_user_v1";

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  const login = (username: string) => {
    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      username: username.trim() || "Commander",
      avatar: "⭐",
    };
    setUser(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    }
  };

  const signup = (username: string) => {
    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      username: username.trim(),
      avatar: "🎖️",
    };
    setUser(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
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
