import { useState, useEffect } from "react";

export function useAdminAuth() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    // Check localStorage first
    try {
      const stored = localStorage.getItem("adminLoggedIn");
      return stored === "true";
    } catch {
      return false;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only verify session once on mount
    const verifySession = async () => {
      try {
        const res = await fetch("/api/admin/current-admin", {
          credentials: "include",
        });
        if (res.ok) {
          setIsAdminLoggedIn(true);
          localStorage.setItem("adminLoggedIn", "true");
        } else {
          setIsAdminLoggedIn(false);
          localStorage.removeItem("adminLoggedIn");
        }
      } catch {
        // Network error - trust localStorage
        const stored = localStorage.getItem("adminLoggedIn") === "true";
        setIsAdminLoggedIn(stored);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []); // Only run once on mount

  const logout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    setIsAdminLoggedIn(false);
    localStorage.removeItem("adminLoggedIn");
  };

  const login = (username: string) => {
    setIsAdminLoggedIn(true);
    localStorage.setItem("adminLoggedIn", "true");
  };

  return {
    isAdminLoggedIn,
    isLoading,
    logout,
    login,
  };
}
