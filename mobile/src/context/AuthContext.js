import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "../api/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    const access = await getAccessToken();
    const refresh = await getRefreshToken();
    if (!access && !refresh) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await api.me();
      setUser(profile);
    } catch {
      if (refresh) {
        try {
          const tokens = await api.refresh(refresh);
          await setTokens(tokens.access, refresh);
          const profile = await api.me();
          setUser(profile);
          setLoading(false);
          return;
        } catch {
          await clearTokens();
        }
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  async function login(credentials) {
    const tokens = await api.login(credentials);
    await setTokens(tokens.access, tokens.refresh);
    const profile = await api.me();
    setUser(profile);
    return profile;
  }

  async function register(payload) {
    await api.register(payload);
    return login({ username: payload.username, password: payload.password });
  }

  async function logout() {
    await clearTokens();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refreshUser: loadUser,
      isStaff: Boolean(user?.is_staff),
      isAuthenticated: Boolean(user),
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
