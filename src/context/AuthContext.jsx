"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

      // ✅ FIXED: Check both ok and status
      if (!res.ok || res?.data?.status !== "success") {
        setLoading(false); 
        return res;
      }

      // ✅ CORRECT: Access user from nested data
      if (res.data?.data?.user) {  
        setUser(res.data.data.user);
        localStorage.setItem("taskmate-user", JSON.stringify(res.data.data.user));
      }

      setLoading(false); 
      return res;
      
    } catch (err) {
      console.error("Login error:", err);
      setLoading(false); 
      throw err;
    }
  };

  const signup = async (data) => {
    setLoading(true);
    try {
      const res = await api.signup(data);
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      throw err;
    }
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