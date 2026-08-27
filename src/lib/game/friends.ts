export interface Friend {
  username: string;
  avatar: string;
  status: "online" | "in_game" | "offline";
  addedAt: number;
}

export interface MatchInvite {
  id: string;
  senderUsername: string;
  receiverUsername: string;
  roomId: string;
  createdAt: number;
}

const FRIENDS_STORAGE_KEY = "gog_friends_list_v1";
const INVITES_STORAGE_KEY = "gog_match_invites_v1";

export const DEFAULT_MOCK_FRIENDS: Friend[] = [
  { username: "General_Eisenhower", avatar: "⭐", status: "online", addedAt: Date.now() - 100000 },
  { username: "SalpakanKing_PH", avatar: "🎖️", status: "online", addedAt: Date.now() - 500000 },
  { username: "VanguardSpy99", avatar: "🎯", status: "in_game", addedAt: Date.now() - 900000 },
];

export function getFriends(): Friend[] {
  if (typeof window === "undefined") return DEFAULT_MOCK_FRIENDS;
  try {
    const raw = localStorage.getItem(FRIENDS_STORAGE_KEY);
    if (!raw) return DEFAULT_MOCK_FRIENDS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MOCK_FRIENDS;
  } catch (e) {
    return DEFAULT_MOCK_FRIENDS;
  }
}

export function addFriend(username: string): Friend[] {
  const cleanName = username.trim();
  if (!cleanName) return getFriends();

  const existing = getFriends();
  if (existing.some((f) => f.username.toLowerCase() === cleanName.toLowerCase())) {
    return existing;
  }

  const newFriend: Friend = {
    username: cleanName,
    avatar: "🎖️",
    status: "online",
    addedAt: Date.now(),
  };

  const updated = [newFriend, ...existing];
  if (typeof window !== "undefined") {
    localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function removeFriend(username: string): Friend[] {
  const existing = getFriends();
  const updated = existing.filter((f) => f.username.toLowerCase() !== username.toLowerCase());
  if (typeof window !== "undefined") {
    localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function sendMatchInvite(senderUsername: string, receiverUsername: string, roomId: string): MatchInvite {
  const invite: MatchInvite = {
    id: `inv-${Date.now()}`,
    senderUsername,
    receiverUsername,
    roomId,
    createdAt: Date.now(),
  };

  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(INVITES_STORAGE_KEY);
    const existing: MatchInvite[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(INVITES_STORAGE_KEY, JSON.stringify([invite, ...existing]));
    window.dispatchEvent(new Event("storage"));
  }
  return invite;
}

export function getPendingInvites(username: string): MatchInvite[] {
  if (typeof window === "undefined" || !username) return [];
  try {
    const raw = localStorage.getItem(INVITES_STORAGE_KEY);
    const existing: MatchInvite[] = raw ? JSON.parse(raw) : [];
    return existing.filter((inv) => inv.receiverUsername.toLowerCase() === username.toLowerCase());
  } catch (e) {
    return [];
  }
}

export function clearInvite(inviteId: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(INVITES_STORAGE_KEY);
    const existing: MatchInvite[] = raw ? JSON.parse(raw) : [];
    const updated = existing.filter((inv) => inv.id !== inviteId);
    localStorage.setItem(INVITES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {}
}
