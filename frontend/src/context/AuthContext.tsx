import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";
import { api } from "../lib/api";
import type { AuthSession, CurrentUser, SignInRequest, SignUpRequest } from "../types/api";

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  session: AuthSession | null;
  user: CurrentUser | null;
  signIn: (payload: SignInRequest) => Promise<void>;
  signUp: (payload: SignUpRequest) => Promise<void>;
  signInAsGuest: (label?: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "nexusai-auth-session";

export const AuthProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      setIsLoading(false);
      return;
    }

    const parsed = JSON.parse(stored) as AuthSession;
    setSession(parsed);

    if (parsed.isGuest) {
      setUser({
        id: parsed.id,
        fullName: parsed.fullName ?? "Guest User",
        email: parsed.email,
        language: parsed.language ?? "en",
        isActive: true,
        isGuest: true
      });
      setIsLoading(false);
      return;
    }

    void api
      .me(parsed.token)
      .then((me) => setUser(me))
      .catch(() => {
        window.localStorage.removeItem(STORAGE_KEY);
        setSession(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const persistSession = (nextSession: AuthSession, me: CurrentUser | null) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    setUser(me);
  };

  const signIn = async (payload: SignInRequest): Promise<void> => {
    const nextSession = await api.signIn(payload);
    const me = await api.me(nextSession.token);
    persistSession(nextSession, me);
  };

  const signUp = async (payload: SignUpRequest): Promise<void> => {
    const nextSession = await api.signUp(payload);
    const me = await api.me(nextSession.token);
    persistSession(nextSession, me);
  };

  const signInAsGuest = (label = "Guest"): void => {
    const guestSession: AuthSession = {
      id: `guest-${Date.now()}`,
      email: "guest@nexusai.local",
      token: `guest-token-${Date.now()}`,
      fullName: `${label} Guest`,
      language: "en",
      isGuest: true
    };

    persistSession(guestSession, {
      id: guestSession.id,
      fullName: guestSession.fullName ?? "Guest User",
      email: guestSession.email,
      language: guestSession.language ?? "en",
      isActive: true,
      isGuest: true
    });
  };

  const signOut = (): void => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(null);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(session?.token),
      isLoading,
      session,
      user,
      signInAsGuest,
      signIn,
      signOut,
      signUp
    }),
    [isLoading, session, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
