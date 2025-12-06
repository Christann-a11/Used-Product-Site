import { useCallback, useState } from "react";
import { API_BASE } from "../config";

export function useAuthentication() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // LOGIN using username OR email
  const login = useCallback(async (emailOrUsername, password) => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailOrUsername,   // backend supports email OR username
          username: emailOrUsername,
          password,
        }),
      });

      if (!res.ok) throw new Error("Invalid login credentials");

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.username);

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // REGISTER user with full marketplace fields
  const register = useCallback(
    async (firstName, lastName, username, email, password) => {
      setError(null);
      setLoading(true);

      try {
        const res = await fetch(`${API_BASE}/api/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            username,
            email,
            password,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || "Registration failed");
        }

        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
  };

  // CHECK IF USER IS LOGGED IN
  const isAuthenticated = () => !!localStorage.getItem("token");

  return {
    login,
    register,
    logout,
    isAuthenticated,
    error,
    loading,
  };
}
