import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { getCurrentUser, loginUser, registerUser } from "../services/api/auth";
import { tokenStorage } from "../services/auth/tokenStorage";
import { User } from "../types";

export type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  const loadFromStorage = useCallback(async () => {
    setLoading(true);
    const storedToken = await tokenStorage.getAccessToken();

    if (!storedToken) {
      setUser(null);
      setToken(null);
      setIsGuest(false);
      setLoading(false);
      return;
    }

    try {
      const me = await getCurrentUser(storedToken);
      setToken(storedToken);
      setUser(me);
      setIsGuest(false);
    } catch (error) {
      console.warn("[Auth] Failed to restore session", error);
      await tokenStorage.clear();
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      await tokenStorage.setAccessToken(response.accessToken);
      const me = await getCurrentUser(response.accessToken);
      setToken(response.accessToken);
      setUser(me);
      setIsGuest(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Giriş başarısız.";
      Alert.alert("Giriş başarısız", message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await registerUser({ name, email, password });
      await tokenStorage.setAccessToken(response.accessToken);
      const me = await getCurrentUser(response.accessToken);
      setToken(response.accessToken);
      setUser(me);
      setIsGuest(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Üyelik başarısız.";
      Alert.alert("Üyelik başarısız", message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await tokenStorage.clear();
    setUser(null);
    setToken(null);
    setIsGuest(false);
  }, []);

  const continueAsGuest = useCallback(async () => {
    await tokenStorage.clear();
    setUser(null);
    setToken(null);
    setIsGuest(true);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isGuest,
      login,
      register,
      logout,
      continueAsGuest,
      loadFromStorage,
    }),
    [user, token, loading, isGuest, login, register, logout, continueAsGuest, loadFromStorage]
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
