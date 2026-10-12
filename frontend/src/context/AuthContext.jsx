import { createContext, useContext, useEffect, useState } from "react";

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
          throw new Error(result.message || "Unable to verify the saved session.");
        }
        if (isMounted) setUser(result.user);
      })
      .catch(() => {
        clearStoredToken();
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

  const logout = () => {
    clearStoredToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
