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
