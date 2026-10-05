import { createContext, useContext, useMemo, useState } from "react";
import initialAdminData from "../data/adminData";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [users, setUsers] = useState(initialAdminData.users);
  const [students, setStudents] = useState(initialAdminData.students);
  const [organizers, setOrganizers] = useState(initialAdminData.organizers);
  const [events, setEvents] = useState(initialAdminData.events);
  const [registrations] = useState(initialAdminData.registrations);
  const [announcements, setAnnouncements] = useState(initialAdminData.announcements);
  const [notifications, setNotifications] = useState(initialAdminData.notifications);
  const [activityLogs, setActivityLogs] = useState(initialAdminData.activityLogs);

  const addActivity = (action, user = "Admin User", role = "Administrator") => {
    const now = new Date();
    const log = {
      id: Date.now() + Math.random(),
      action,
      user,
      role,
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
    setActivityLogs((current) => [log, ...current]);
  };

  const addUser = (user) => {
    const newUser = { ...user, id: Date.now(), registeredDate: user.registeredDate || new Date().toISOString().slice(0, 10) };
    setUsers((current) => [newUser, ...current]);
    addActivity(`Added ${newUser.role.toLowerCase()} account for ${newUser.name}`);
    return newUser;
  };

  const updateUser = (userId, updates) => {
    setUsers((current) => current.map((user) => String(user.id) === String(userId) ? { ...user, ...updates } : user));
    setStudents((current) => current.map((student) => String(student.userId) === String(userId) ? { ...student, ...updates, name: updates.name ?? student.name, email: updates.email ?? student.email } : student));
    setOrganizers((current) => current.map((organizer) => String(organizer.userId) === String(userId) ? { ...organizer, ...updates, name: updates.name ?? organizer.name, email: updates.email ?? organizer.email } : organizer));
    addActivity(`Updated user account ${userId}`);
  };

  const deleteUser = (userId) => {
    const deleted = users.find((user) => String(user.id) === String(userId));
    setUsers((current) => current.filter((user) => String(user.id) !== String(userId)));
    setStudents((current) => current.filter((student) => String(student.userId) !== String(userId)));
    setOrganizers((current) => current.filter((organizer) => String(organizer.userId) !== String(userId)));
    if (deleted) addActivity(`Deleted user account for ${deleted.name}`);
  };

  const updateStudent = (studentId, updates) => {
    setStudents((current) => current.map((student) => String(student.id) === String(studentId) ? { ...student, ...updates } : student));
    const student = students.find((item) => String(item.id) === String(studentId));
    if (student?.userId) setUsers((current) => current.map((user) => String(user.id) === String(student.userId) ? { ...user, ...(updates.name ? { name: updates.name } : {}), ...(updates.email ? { email: updates.email } : {}), ...(updates.status ? { status: updates.status } : {}) } : user));
    addActivity(`Updated student record ${student?.name || studentId}`);
  };

  const updateOrganizer = (organizerId, updates) => {
    setOrganizers((current) => current.map((organizer) => String(organizer.id) === String(organizerId) ? { ...organizer, ...updates } : organizer));
    const organizer = organizers.find((item) => String(item.id) === String(organizerId));
    if (organizer?.userId) setUsers((current) => current.map((user) => String(user.id) === String(organizer.userId) ? { ...user, ...(updates.name ? { name: updates.name } : {}), ...(updates.email ? { email: updates.email } : {}), ...(updates.status ? { status: updates.status } : {}) } : user));
    addActivity(`Updated organizer record ${organizer?.name || organizerId}`);
  };

  const addEvent = (event) => {
    const newEvent = { ...event, id: Date.now(), registrations: 0, createdDate: new Date().toISOString().slice(0, 10), submittedDate: new Date().toISOString().slice(0, 10) };
    setEvents((current) => [newEvent, ...current]);
    addActivity(`Created event ${newEvent.title}`);
    return newEvent;
  };

  const updateEvent = (eventId, updates) => {
    setEvents((current) => current.map((event) => String(event.id) === String(eventId) ? { ...event, ...updates } : event));
    const event = events.find((item) => String(item.id) === String(eventId));
    addActivity(`Updated event ${event?.title || eventId}`);
  };

  const deleteEvent = (eventId) => {
    const event = events.find((item) => String(item.id) === String(eventId));
    setEvents((current) => current.filter((item) => String(item.id) !== String(eventId)));
    if (event) addActivity(`Deleted event ${event.title}`);
  };

  const approveEvent = (eventId) => {
    const event = events.find((item) => String(item.id) === String(eventId));
    setEvents((current) => current.map((item) => String(item.id) === String(eventId) ? { ...item, status: "Published", rejectionReason: "" } : item));
    if (event) addActivity(`Approved ${event.title}`);
  };

  const rejectEvent = (eventId, reason) => {
    const event = events.find((item) => String(item.id) === String(eventId));
    setEvents((current) => current.map((item) => String(item.id) === String(eventId) ? { ...item, status: "Rejected", rejectionReason: reason } : item));
    if (event) addActivity(`Rejected ${event.title}${reason ? `: ${reason}` : ""}`);
  };

  const addAnnouncement = (announcement) => {
    const newAnnouncement = { ...announcement, id: Date.now() };
    setAnnouncements((current) => [newAnnouncement, ...current]);
    addActivity(`Created announcement ${newAnnouncement.title}`);
  };

  const updateAnnouncement = (announcementId, updates) => {
    setAnnouncements((current) => current.map((item) => String(item.id) === String(announcementId) ? { ...item, ...updates } : item));
    addActivity(`Updated announcement ${updates.title || announcementId}`);
  };

  const deleteAnnouncement = (announcementId) => {
    const announcement = announcements.find((item) => String(item.id) === String(announcementId));
    setAnnouncements((current) => current.filter((item) => String(item.id) !== String(announcementId)));
    if (announcement) addActivity(`Deleted announcement ${announcement.title}`);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications((current) => current.map((item) => String(item.id) === String(notificationId) ? { ...item, read: true } : item));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  };

  const value = useMemo(() => ({
    users, students, organizers, events, registrations, announcements, notifications, activityLogs,
    addUser, updateUser, deleteUser, updateStudent, updateOrganizer,
    addEvent, updateEvent, deleteEvent, approveEvent, rejectEvent,
    addAnnouncement, updateAnnouncement, deleteAnnouncement,
    markNotificationAsRead, markAllNotificationsAsRead,
  }), [users, students, organizers, events, registrations, announcements, notifications, activityLogs]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used inside AdminProvider");
  return context;
}
