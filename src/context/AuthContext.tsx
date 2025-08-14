'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

type AuthContextType = {
  userId: string;
  isGuest: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthContextType | null>(null);

  useEffect(() => {
    // Check if logged-in user exists
    // Todo replace with real auth check
    const loggedInUserId = null; // e.g. from JWT, session, etc.

    if (loggedInUserId) {
      setAuth({ userId: loggedInUserId, isGuest: false });
    } else {
      let guestId = localStorage.getItem('guestId');
      if (!guestId) {
        guestId = uuid();
        localStorage.setItem('guestId', guestId);
      }
      setAuth({ userId: guestId, isGuest: true });
    }
  }, []);

  if (!auth) return null; // or loading spinner

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
