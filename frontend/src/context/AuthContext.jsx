import { createContext, useContext, useState } from "react";

const MOCK_SESSION_KEY = "uems.mockSession";
const roles = ["student", "organizer", "admin"];
const AuthContext = createContext(null);

function readMockSession() {
  const storedSession = window.localStorage.getItem(MOCK_SESSION_KEY);
  if (!storedSession) return null;

  let session;
  try {
    session = JSON.parse(storedSession);
  } catch {
    window.localStorage.removeItem(MOCK_SESSION_KEY);
    return null;
  }

  if (!session || !roles.includes(session.role) || typeof session.email !== "string") {
    window.localStorage.removeItem(MOCK_SESSION_KEY);
    return null;
  }

  return session;
}

function roleFromEmail(email) {
  const username = email.trim().split("@")[0]?.toLowerCase();
  if (username === "admin") return "admin";
  if (username === "organizer") return "organizer";
  return "student";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readMockSession);

  const login = (email) => {
    // Replace this local-only role mapping with POST /api/auth/login when the backend exists.
    const session = { email: email.trim(), role: roleFromEmail(email) };
    window.localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return session.role;
  };

  const logout = () => {
    window.localStorage.removeItem(MOCK_SESSION_KEY);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
