import { createContext, useContext, useEffect, useState } from "react";

import api from "../api/client";

const AuthContext = createContext(null);

const storageKeys = {
  token: "wealthwave-token",
  user: "wealthwave-user",
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(storageKeys.token));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(storageKeys.user);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const persistSession = (payload) => {
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem(storageKeys.token, payload.token);
    localStorage.setItem(storageKeys.user, JSON.stringify(payload.user));
  };

  const login = async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", formData);
      persistSession(data);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: error.response?.data?.message || "Unable to login",
      };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", formData);
      persistSession(data);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: error.response?.data?.message || "Unable to create account",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(storageKeys.token);
    localStorage.removeItem(storageKeys.user);
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    api.get("/auth/me").catch(() => logout());
  }, [token]);

  const value = {
    token,
    user,
    loading,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
