"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface UserContextType {
  user: any;
  loading: boolean;
  refreshUser: () => Promise<void>;
  awardXP: (amount: number) => Promise<void>;
  claimBelt: (language: string, belt: string) => Promise<any>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  awardXP: async () => {},
  claimBelt: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/user', { cache: 'no-store' });
      const data = await res.json();
      setUser(data);
    } catch (e) {
      console.error("Failed to refresh user:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const awardXP = useCallback(async (amount: number) => {
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xpDelta: amount }),
      });
      const updated = await res.json();
      setUser(updated);
    } catch (e) {
      console.error("Failed to award XP:", e);
    }
  }, []);

  const claimBelt = useCallback(async (language: string, belt: string) => {
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimBelt: { language, belt } }),
      });
      const updated = await res.json();
      setUser(updated);
      return updated.newCert;
    } catch (e) {
      console.error("Failed to claim belt:", e);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    // Poll every 15 seconds to stay in sync
    const interval = setInterval(refreshUser, 15000);
    return () => clearInterval(interval);
  }, [refreshUser]);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, awardXP, claimBelt }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
