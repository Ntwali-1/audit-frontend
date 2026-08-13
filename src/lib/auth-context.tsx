import * as React from "react";

export type PortalType = "INSTITUTION" | "OAG" | "OCIA";

export type OrganizationType =
  | "GOVERNMENT_DISTRICT"
  | "GOVERNMENT_INSTITUTION"
  | "PRIVATE_COMPANY"
  | "OAG"
  | "OCIA";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  /** Which of the three portals this account belongs to. */
  portalType?: PortalType;
  organizationId?: string;
  organizationName?: string | null;
  /** Drives the crest: public bodies carry the coat of arms, private their own. */
  organizationType?: OrganizationType | null;
  /** Operates the platform: reviews institution registrations. Not a role. */
  isPlatformAdmin?: boolean;
  isVerified: boolean;
  profileCompleted: boolean;
  requiresProfileCompletion?: boolean;
  createdAt?: string;
}

interface StoredSession {
  token: string | null;
  user: AuthUser | null;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  /** True only until the stored session has been read. */
  isLoading: boolean;
  /**
   * Defaults to INSTITUTION so a session stored before portals existed keeps
   * seeing the product it always saw.
   */
  portal: PortalType;
  setAuth: (token: string, refreshToken: string, user: AuthUser) => void;
  clearAuth: () => void;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

/**
 * Reads the session synchronously. Returns empties on the server, where there
 * is no localStorage.
 */
function readStoredSession(): StoredSession {
  if (typeof window === "undefined") return { token: null, user: null };
  try {
    const token = localStorage.getItem("access_token");
    const raw = localStorage.getItem("auth_user");
    return { token, user: raw ? (JSON.parse(raw) as AuthUser) : null };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  /*
   * The session used to load inside an effect, which meant the very first paint
   * after a hard page load always rendered with `user === null` — long enough
   * for the shell to show "Unknown" until a re-render replaced it. That is the
   * flicker that looked like it needed a manual reload.
   *
   * It is read synchronously in the initialiser instead, so on the client the
   * user is present from the first render. The effect below is kept only to
   * re-sync after hydration, because the server render legitimately has no
   * storage to read.
   */
  const [session, setSession] = React.useState<StoredSession>(() => readStoredSession());
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setSession(readStoredSession());
    setIsLoading(false);
  }, []);

  // Keep tabs in sync: signing out in one should not leave another looking
  // signed in.
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token" || e.key === "auth_user") setSession(readStoredSession());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setAuth = React.useCallback(
    (accessToken: string, refreshToken: string, authUser: AuthUser) => {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("auth_user", JSON.stringify(authUser));
      setSession({ token: accessToken, user: authUser });
      setIsLoading(false);
    },
    [],
  );

  const clearAuth = React.useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("auth_user");
    setSession({ token: null, user: null });
    setIsLoading(false);
  }, []);

  const value = React.useMemo<AuthContextType>(
    () => ({
      user: session.user,
      token: session.token,
      isLoading,
      portal: session.user?.portalType ?? "INSTITUTION",
      setAuth,
      clearAuth,
    }),
    [session, isLoading, setAuth, clearAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

/** Convenience for the many places that branch on which portal is signed in. */
export function usePortal() {
  const { portal, user } = useAuth();
  return {
    portal,
    isInstitution: portal === "INSTITUTION",
    isOag: portal === "OAG",
    isOcia: portal === "OCIA",
    organizationId: user?.organizationId ?? null,
    organizationName: user?.organizationName ?? null,
    organizationType: user?.organizationType ?? null,
  };
}

/**
 * Which crest to show. Public bodies and the two national offices carry the
 * coat of arms; private organizations carry the product logo.
 */
export function useBrandMark(): { src: string; alt: string } {
  const { user } = useAuth();
  const isPrivate = user?.organizationType === "PRIVATE_COMPANY";
  return isPrivate
    ? { src: "/logo.png", alt: user?.organizationName ?? "Auditly" }
    : { src: "/Coat_of_arms_of_Rwanda.svg", alt: "Republic of Rwanda" };
}
