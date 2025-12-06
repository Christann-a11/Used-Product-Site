// src/Controllers/UseAuthentication.js
import { useState, useEffect } from "react";

export const useAuthentication = () => {
  // Store whether user is authenticated
  const [auth, setAuth] = useState(() => {
    return !!localStorage.getItem("token");
  });

  // Listen for global "auth-changed" events
  useEffect(() => {
    const handler = () => {
      setAuth(!!localStorage.getItem("token"));
    };

    window.addEventListener("auth-changed", handler);

    return () => window.removeEventListener("auth-changed", handler);
  }, []);

  // Login → store credentials + broadcast event
  const login = (token, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);

    window.dispatchEvent(new Event("auth-changed"));
  };

  // Logout → clear credentials + broadcast event
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    window.dispatchEvent(new Event("auth-changed"));
  };

  // Check authentication status
  const isAuthenticated = () => auth;

  return {
    isAuthenticated,
    login,
    logout,
  };
};
