"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on first mount
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

    const res = await api.login({ email, password });

    if (res?.data?.success) {
      // 🔥 cookie is already set by backend

      // fetch profile using cookie
      const profileRes = await api.getProfile();

      if (profileRes?.data?.success) {
        setUser(profileRes.data.data);
        localStorage.setItem(
          "taskmate-user",
          JSON.stringify(profileRes.data.data)
        );
      }
    }

    setLoading(false);
    return res;
  };



  const signup = async (data) => {
    return api.signup(data);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch { }
    setUser(null);
    localStorage.removeItem("taskmate-user");
    localStorage.removeItem("taskmate-token");
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
