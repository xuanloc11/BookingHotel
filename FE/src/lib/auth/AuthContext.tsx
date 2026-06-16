"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import type { UserProfile } from "@/types/user";
import { fetchCurrentUser } from "@/lib/api/userApi";
import {
  logout as apiLogout,
  readStoredAccessToken,
} from "@/lib/api/authApi";

/* ------------------------------------------------------------------ */
/*  Context shape                                                      */
/* ------------------------------------------------------------------ */

interface AuthContextValue {
  /** The currently authenticated user, or null when logged out. */
  user: UserProfile | null;
  /** True while the initial session check is in progress. */
  loading: boolean;
  /** Replace the current user (called after login / register). */
  setUser: (user: UserProfile) => void;
  /** Log out, clear session, and redirect to the login page. */
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  setUser: () => {},
  handleLogout: async () => {},
});

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /* On mount, attempt to restore the session from the stored token. */
  useEffect(() => {
    const token = readStoredAccessToken();

    if (!token) {
      setLoading(false);
      return;
    }

    fetchCurrentUser({ authToken: token })
      .then((profile) => setUser(profile))
      .catch(() => {
        /* Token expired or invalid – silently clear. */
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
      router.push("/login");
      router.refresh();
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
