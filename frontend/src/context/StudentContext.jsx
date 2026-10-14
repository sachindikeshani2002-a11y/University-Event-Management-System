import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const { user, request } = useAuth();
  const [savedByUser, setSavedByUser] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  const refreshRegistrations = useCallback(async () => {
    if (user?.role !== "student") {
      setRegistrations([]);
      setIsLoadingRegistrations(false);
      setRegistrationError("");
      return;
    }
    setIsLoadingRegistrations(true);
    setRegistrationError("");
    try {
      const result = await request("/api/registrations/mine");
      setRegistrations(result.registrations || []);
    } catch (error) {
      setRegistrationError(error.message || "Unable to load your registrations.");
    } finally {
      setIsLoadingRegistrations(false);
    }
  }, [request, user]);

  useEffect(() => {
    Promise.resolve().then(refreshRegistrations);
  }, [refreshRegistrations]);

  useEffect(() => {
    if (!user?.id || savedByUser[user.id]) return;
    Promise.resolve().then(() => {
      try {
        const saved = JSON.parse(window.localStorage.getItem(`uems.savedEvents.${user.id}`) || "[]");
        if (Array.isArray(saved)) setSavedByUser((current) => ({ ...current, [user.id]: saved }));
      } catch {
        setSavedByUser((current) => ({ ...current, [user.id]: [] }));
      }
    });
  }, [savedByUser, user?.id]);

  const savedEvents = user?.id ? (savedByUser[user.id] || []) : [];

  const registeredEvents = registrations.map((registration) =>
    String(registration.event?._id || registration.event?.id || registration.event)
  );

  const toggleSaveEvent = (eventId) => {
    if (!user?.id) return;
    const current = savedByUser[user.id] || [];
    const next = current.includes(eventId) ? current.filter((id) => id !== eventId) : [...current, eventId];
    setSavedByUser((all) => ({ ...all, [user.id]: next }));
    try {
      window.localStorage.setItem(`uems.savedEvents.${user.id}`, JSON.stringify(next));
    } catch {
      // Saving is still available until the page is refreshed if storage is disabled.
    }
  };

  const registerForEvent = async (eventId) => {
    await request(`/api/registrations/${eventId}`, { method: "POST", body: "{}" });
    await refreshRegistrations();
  };

  const cancelRegistration = async (registrationId) => {
    await request(`/api/registrations/${registrationId}`, { method: "DELETE" });
    await refreshRegistrations();
  };

  return (
    <StudentContext.Provider value={{
      savedEvents, registeredEvents, registrations, isLoadingRegistrations, registrationError,
      toggleSaveEvent, registerForEvent, cancelRegistration, refreshRegistrations,
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) throw new Error("useStudent must be used inside StudentProvider");
  return context;
}
