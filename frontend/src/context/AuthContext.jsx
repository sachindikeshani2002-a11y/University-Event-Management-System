import { createContext, useCallback, useContext, useEffect, useState } from "react";

const TOKEN_KEY = "uems.authToken";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const AuthContext = createContext(null);

function getStoredToken() {
  return window.localStorage.getItem(TOKEN_KEY) || window.sessionStorage.getItem(TOKEN_KEY);
}

function clearStoredToken() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(getStoredToken()));

  useEffect(() => {
    let isMounted = true;
    const token = getStoredToken();
    window.localStorage.removeItem("uems.mockSession");

    if (!token) {
      return () => {
        isMounted = false;
      };
    }

    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          if (response.status === 401) clearStoredToken();
          throw new Error(result.message || "Unable to verify the saved session.");
        }
        if (isMounted) setUser(result.user);
      })
      .catch(() => {
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password, rememberMe) => {
    let response;
    try {
      response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch {
      throw new Error("Unable to reach the authentication server. Check that the backend is running.");
    }
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Unable to sign in.");
    }

    clearStoredToken();
    const storage = rememberMe ? window.localStorage : window.sessionStorage;
    storage.setItem(TOKEN_KEY, result.token);
    setUser(result.user);
    return result.user;
  };

  const logout = useCallback(() => {
    clearStoredToken();
    setUser(null);
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    let response;
    try {
      response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
      });
    } catch {
      throw new Error("Unable to reach the authentication server. Check that the backend is running.");
    }

    let result = {};
    try {
      result = await response.json();
    } catch {
      // Non-JSON server responses are handled with a safe generic message below.
    }

    if (!response.ok) {
      const message = response.status >= 500
        ? "Registration is temporarily unavailable. Please try again later."
        : result.message || "Unable to create your account. Please check your details.";
      throw new Error(message);
    }

    return result.user;
  }, []);

  const request = useCallback(async (path, options = {}) => {
    const token = getStoredToken();
    const headers = new Headers(options.headers || {});
    if (options.body != null && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    let response;
    try {
      response = await fetch(`${API_URL}${path}`, { ...options, headers });
    } catch {
      throw new Error("Unable to reach the server. Check that the backend is running.");
    }
    let result = {};
    try {
      result = response.status === 204 ? {} : await response.json();
    } catch {
      // Use a safe generic message if the server did not return JSON.
    }
    if (response.status === 401 && token) logout();
    if (!response.ok) {
      const message = response.status >= 500
        ? "The request could not be completed. Please try again later."
        : result.message || "The request could not be completed.";
      throw new Error(message);
    }
    return result;
  }, [logout]);

  const updateProfile = useCallback(async (updates) => {
    const result = await request("/api/auth/me", { method: "PATCH", body: JSON.stringify(updates) });
    setUser(result.user);
    return result.user;
  }, [request]);

  return (
    <AuthContext.Provider value={{ user, login, register, request, updateProfile, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
