"use client";

import { useState, useEffect } from "react";

const PLAYER_NAME_KEY = "gog_player_name_v3";

export function getPlayerName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(PLAYER_NAME_KEY) || "";
}

export function setPlayerName(name: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(PLAYER_NAME_KEY, name.trim());
  }
}

export function usePlayerSession() {
  const [name, setNameState] = useState<string>("");

  useEffect(() => {
    setNameState(getPlayerName());
  }, []);

  const saveName = (newName: string) => {
    setPlayerName(newName);
    setNameState(newName.trim());
  };

  return { name, saveName };
}
