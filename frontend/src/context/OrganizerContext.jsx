import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const OrganizerContext = createContext(null);

function normalizeEvent(event) {
  const date = new Date(event.date);
  const formatTime = (value) => value ? new Date(`1970-01-01T${value}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";
  return {
    ...event,
    id: event._id || event.id,
    date: date.toISOString().slice(0, 10),
    time: `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`,
    maxParticipants: event.capacity ?? "",
  };
}

export function OrganizerProvider({ children }) {
  const { user, request } = useAuth();
  const [organizerEvents, setOrganizerEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [error, setError] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const refreshEvents = useCallback(async () => {
    if (user?.role !== "organizer") {
      setOrganizerEvents([]);
      setRegistrations([]);
      setError("");
      return;
    }
    setIsLoadingEvents(true);
    setError("");
    try {
      const result = await request("/api/events/mine");
      setOrganizerEvents((result.events || []).map(normalizeEvent));
    } catch (loadError) {
      setError(loadError.message || "Unable to load your events.");
    } finally {
      setIsLoadingEvents(false);
    }
  }, [request, user]);

  const refreshRegistrations = useCallback(async () => {
    if (user?.role !== "organizer") {
      setRegistrations([]);
      return;
    }
    try {
      const result = await request("/api/registrations/organizer");
      setRegistrations((result.registrations || []).map((item) => ({
        id: item._id,
        studentName: item.student?.name || "Student",
        email: item.student?.email || "",
        studentId: "",
        eventTitle: item.event?.title || "Event unavailable",
        eventId: item.event?._id,
        registrationDate: item.createdAt,
        status: item.status,
      })));
    } catch (loadError) {
      setError(loadError.message || "Unable to load event registrations.");
    }
  }, [request, user]);

  const refreshAnnouncements = useCallback(async () => {
    if (user?.role !== "organizer") { setAnnouncements([]); return; }
    try {
      const result = await request("/api/announcements");
      setAnnouncements((result.announcements || []).map((item) => ({ ...item, id: item._id || item.id, date: String(item.date).slice(0, 10) })));
    } catch (loadError) {
      setError(loadError.message || "Unable to load announcements.");
    }
  }, [request, user]);

  useEffect(() => { Promise.resolve().then(refreshEvents); }, [refreshEvents]);
  useEffect(() => { Promise.resolve().then(refreshRegistrations); }, [refreshRegistrations]);
  useEffect(() => { Promise.resolve().then(refreshAnnouncements); }, [refreshAnnouncements]);

  const addEvent = async (event) => {
    await request("/api/events", {
      method: "POST",
      body: JSON.stringify({
        ...event,
        date: event.date,
        capacity: event.maxParticipants,
        registrationDeadline: event.registrationDeadline || event.date,
      }),
    });
    await refreshEvents();
  };

  const updateEvent = async (eventId, event) => {
    await request(`/api/events/${eventId}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...event,
        date: event.date,
        capacity: event.maxParticipants ?? event.capacity,
        registrationDeadline: event.registrationDeadline || event.date,
      }),
    });
    await refreshEvents();
  };

  const deleteEvent = async (eventId) => {
    await request(`/api/events/${eventId}/cancel`, { method: "PATCH", body: "{}" });
    await refreshEvents();
  };

  const addAnnouncement = async (announcement) => {
    await request("/api/announcements", { method: "POST", body: JSON.stringify(announcement) });
    await refreshAnnouncements();
  };
  const updateAnnouncement = async (id, updates) => {
    await request(`/api/announcements/${id}`, { method: "PATCH", body: JSON.stringify(updates) });
    await refreshAnnouncements();
  };
  const deleteAnnouncement = async (id) => {
    await request(`/api/announcements/${id}`, { method: "DELETE" });
    await refreshAnnouncements();
  };
  const markNotificationAsRead = (id) => setNotifications((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));

  return (
    <OrganizerContext.Provider value={{
      organizerEvents, registrations, announcements, notifications,
      isLoadingEvents, error, refreshEvents, refreshRegistrations,
      addEvent, updateEvent, deleteEvent, addAnnouncement, updateAnnouncement,
      deleteAnnouncement, markNotificationAsRead,
    }}>
      {children}
    </OrganizerContext.Provider>
  );
}

export function useOrganizer() {
  const context = useContext(OrganizerContext);
  if (!context) throw new Error("useOrganizer must be used inside OrganizerProvider");
  return context;
}
