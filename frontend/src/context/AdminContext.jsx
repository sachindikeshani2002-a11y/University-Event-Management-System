import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const AdminContext = createContext(null);
const displayRole = (role) => ({ student: "Student", organizer: "Organizer", admin: "Administrator" })[role] || role;

function normalizeEvent(event) {
  return {
    ...event,
    id: event._id || event.id,
    organizer: event.organizer?.name || "Organizer",
    organizerId: event.organizer?._id || event.organizer,
    date: String(event.date).slice(0, 10),
    submittedDate: String(event.createdAt || event.date).slice(0, 10),
    registrations: event.registrationCount || 0,
    capacity: event.capacity || "—",
  };
}

function normalizeUser(user) {
  return { ...user, id: user._id || user.id, role: displayRole(user.role), registeredDate: user.createdAt };
}

export function AdminProvider({ children }) {
  const { user, request } = useAuth();
  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(1);
  const [userTotal, setUserTotal] = useState(0);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [registrationPage, setRegistrationPage] = useState(1);
  const [registrationTotal, setRegistrationTotal] = useState(0);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [notifications] = useState([]);
  const [activityLogs] = useState([]);

  const refresh = useCallback(async () => {
    if (user?.role !== "admin") {
      setUsers([]); setEvents([]); setRegistrations([]); setDashboardStats(null); setAnnouncements([]);
      setUserPage(1); setUserTotal(0); setRegistrationPage(1); setRegistrationTotal(0);
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const [userResult, eventResult, registrationResult, statsResult, announcementResult] = await Promise.all([
        request("/api/admin/users?page=1&limit=100"),
        request("/api/events/admin"),
        request("/api/registrations/admin?page=1&limit=25"),
        request("/api/dashboard/admin"),
        request("/api/announcements"),
      ]);
      setUsers((userResult.users || []).map(normalizeUser));
      setUserPage(1);
      setUserTotal(userResult.total || 0);
      setEvents((eventResult.events || []).map(normalizeEvent));
      setRegistrations((registrationResult.registrations || []).map((item) => ({
        id: item._id,
        student: item.student?.name || "Student",
        studentId: "",
        event: item.event?.title || "Event unavailable",
        eventId: item.event?._id,
        organizer: item.event?.organizer?.name || "Organizer",
        date: item.createdAt,
        status: item.status,
      })));
      setRegistrationPage(1);
      setRegistrationTotal(registrationResult.total || 0);
      setDashboardStats(statsResult);
      setAnnouncements((announcementResult.announcements || []).map((item) => ({ ...item, id: item._id || item.id, date: String(item.date).slice(0, 10) })));
    } catch (loadError) {
      setError(loadError.message || "Unable to load administration data.");
    } finally {
      setIsLoading(false);
    }
  }, [request, user]);

  useEffect(() => { Promise.resolve().then(refresh); }, [refresh]);

  const loadRegistrationPage = async (page) => {
    setIsLoading(true); setError("");
    try {
      const result = await request(`/api/registrations/admin?page=${page}&limit=25`);
      setRegistrations((result.registrations || []).map((item) => ({
        id: item._id, student: item.student?.name || "Student", studentId: "",
        event: item.event?.title || "Event unavailable", eventId: item.event?._id,
        organizer: item.event?.organizer?.name || "Organizer", date: item.createdAt, status: item.status,
      })));
      setRegistrationPage(result.page);
      setRegistrationTotal(result.total || 0);
    } catch (failure) {
      setError(failure.message || "Unable to load registrations.");
    } finally { setIsLoading(false); }
  };

  const loadUserPage = async (page) => {
    setIsLoading(true); setError("");
    try {
      const result = await request(`/api/admin/users?page=${page}&limit=100`);
      setUsers((result.users || []).map(normalizeUser));
      setUserPage(result.page);
      setUserTotal(result.total || 0);
    } catch (failure) {
      setError(failure.message || "Unable to load accounts.");
    } finally { setIsLoading(false); }
  };

  const students = users.filter((item) => item.role === "Student");
  const organizers = users.filter((item) => item.role === "Organizer");

  const updateUser = async (userId, updates) => {
    const role = updates.role ? ({ Student: "student", Organizer: "organizer", Administrator: "admin" })[updates.role] || updates.role : undefined;
    await request(`/api/admin/users/${userId}`, { method: "PATCH", body: JSON.stringify({ name: updates.name, email: updates.email, role }) });
    await refresh();
  };
  const deleteUser = async () => { throw new Error("User deletion is not enabled because registration history must be preserved."); };
  const updateStudent = async (studentId, updates) => updateUser(studentId, updates);
  const updateOrganizer = async (organizerId, updates) => updateUser(organizerId, updates);
  const moderateEvent = async (eventId, status, reason = "") => {
    await request(`/api/events/${eventId}/moderation`, { method: "PATCH", body: JSON.stringify({ status, reason }) });
    await refresh();
  };
  const updateEvent = async (eventId, updates) => moderateEvent(eventId, updates.status);
  const deleteEvent = async (eventId) => moderateEvent(eventId, "Cancelled");
  const approveEvent = async (eventId) => moderateEvent(eventId, "Published");
  const rejectEvent = async (eventId, reason) => moderateEvent(eventId, "Rejected", reason);
  const addAnnouncement = async (item) => {
    await request("/api/announcements", { method: "POST", body: JSON.stringify(item) });
    await refresh();
  };
  const updateAnnouncement = async (id, updates) => {
    await request(`/api/announcements/${id}`, { method: "PATCH", body: JSON.stringify(updates) });
    await refresh();
  };
  const deleteAnnouncement = async (id) => {
    await request(`/api/announcements/${id}`, { method: "DELETE" });
    await refresh();
  };
  const unavailable = () => { throw new Error("This feature is not connected to the backend yet."); };

  return (
    <AdminContext.Provider value={{
      users, students, organizers, events, registrations, announcements, notifications, activityLogs,
      dashboardStats, isLoading, error, refresh, loadRegistrationPage, registrationPage, registrationTotal,
      loadUserPage, userPage, userTotal,
      updateUser, deleteUser, updateStudent, updateOrganizer,
      updateEvent, deleteEvent, approveEvent, rejectEvent,
      addUser: unavailable, addEvent: unavailable, addAnnouncement,
      updateAnnouncement, deleteAnnouncement,
      markNotificationAsRead: unavailable, markAllNotificationsAsRead: unavailable,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used inside AdminProvider");
  return context;
}
