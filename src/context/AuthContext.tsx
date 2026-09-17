import React, { createContext, useContext, useEffect, useState } from 'react';

// Mock auth for the template: there is no real backend, so "session" is just
// a flag persisted in sessionStorage (survives reloads within the same tab,
// cleared when the tab closes). signIn accepts any non-empty email/password —
// it's here purely so the admin demo UI (login form, protected route, logout
// button) keeps working without a Supabase project behind it.

export interface TemplateUser {
  email: string;
}

export type TemplateSession = { user: TemplateUser } | null;

interface AuthContextValue {
  session: TemplateSession;
  user: TemplateUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'template-auth';

function readStoredSession(): TemplateSession {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { email: string };
    return parsed.email ? { user: { email: parsed.email } } : null;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<TemplateSession>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mirrors the original async-init shape (loading flips off once the
    // "session" is resolved), even though reading sessionStorage is sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time init read, not a re-render loop
    setSession(readStoredSession());
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      return { error: 'Email y contraseña son obligatorios.' };
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ email }));
    } catch {
      // sessionStorage unavailable (e.g. private mode) — fall back to in-memory only.
    }
    setSession({ user: { email } });
    return { error: null };
  };

  const signOut = async () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components -- context + hook are colocated intentionally, single small file
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
