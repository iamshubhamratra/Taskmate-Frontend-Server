"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user from localStorage (UI state only)
  useEffect(() => {
    const saved = localStorage.getItem("taskmate-user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("taskmate-user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const res = await api.login({ email, password });

      if (!res?.data?.success) {
        return res; // wrong password handled by UI
      }

      // 🔥 cookie already set by backend
      const profileRes = await api.getProfile();

      if (profileRes?.data?.success) {
        setUser(profileRes.data.data);
        localStorage.setItem(
          "taskmate-user",
          JSON.stringify(profileRes.data.data)
        );
      }

      return res;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    } finally {
      setLoading(false); // 🔥 ALWAYS stops loader
    }
  };

  const signup = async (data) => {
    return api.signup(data);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {}
    setUser(null);
    localStorage.removeItem("taskmate-user");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
