import { createContext, useContext, useMemo, useState } from "react";
import organizerEventData from "../data/organizerEvents";

const OrganizerContext = createContext(null);

const initialRegistrations = [
  { id: 1, studentName: "Nethmi Silva", studentId: "ST2024018", email: "nethmi.silva@university.edu", eventTitle: "University Tech Conference 2026", eventId: 1, registrationDate: "2026-09-24", status: "Attended" },
  { id: 2, studentName: "Kavindu Perera", studentId: "ST2023152", email: "kavindu.perera@university.edu", eventTitle: "Introduction to Artificial Intelligence", eventId: 2, registrationDate: "2026-09-28", status: "Registered" },
  { id: 3, studentName: "Amaya Fernando", studentId: "ST2022094", email: "amaya.fernando@university.edu", eventTitle: "Career & Internship Fair", eventId: 3, registrationDate: "2026-09-29", status: "Registered" },
  { id: 4, studentName: "Ravindu Jayasuriya", studentId: "ST2024055", email: "ravindu.j@university.edu", eventTitle: "Career & Internship Fair", eventId: 3, registrationDate: "2026-09-30", status: "Cancelled" },
  { id: 5, studentName: "Tharushi De Silva", studentId: "ST2023207", email: "tharushi.ds@university.edu", eventTitle: "Research & Innovation Symposium", eventId: 4, registrationDate: "2026-10-01", status: "Registered" },
  { id: 6, studentName: "Isuru Wickramasinghe", studentId: "ST2021186", email: "isuru.w@university.edu", eventTitle: "Introduction to Artificial Intelligence", eventId: 2, registrationDate: "2026-10-02", status: "Registered" },
  { id: 7, studentName: "Piumi Rathnayake", studentId: "ST2023031", email: "piumi.r@university.edu", eventTitle: "Campus Sustainability Forum", eventId: 5, registrationDate: "2026-10-03", status: "Registered" },
  { id: 8, studentName: "Dilan Abeysekara", studentId: "ST2024113", email: "dilan.a@university.edu", eventTitle: "University Tech Conference 2026", eventId: 1, registrationDate: "2026-09-25", status: "Attended" },
];

const initialAnnouncements = [
  { id: 1, title: "Registration Deadline Extended", message: "Registration for the Career & Internship Fair has been extended.", date: "2026-10-04", status: "Published" },
  { id: 2, title: "Venue Update: AI Workshop", message: "The AI workshop will take place in the ICT Auditorium.", date: "2026-10-02", status: "Published" },
  { id: 3, title: "Volunteer Briefing", message: "Volunteer briefing details will be shared closer to the event.", date: "2026-10-01", status: "Draft" },
];

const initialNotifications = [
  { id: 1, type: "registration", title: "New student registration", message: "Kavindu Perera registered for Introduction to Artificial Intelligence.", time: "12 minutes ago", read: false },
  { id: 2, type: "event", title: "Event update saved", message: "The venue details for the Career & Internship Fair were updated.", time: "2 hours ago", read: false },
  { id: 3, type: "milestone", title: "Registration milestone reached", message: "Your events have received more than 450 registrations.", time: "Yesterday", read: false },
  { id: 4, type: "reminder", title: "Upcoming event reminder", message: "Introduction to Artificial Intelligence is coming up on October 8.", time: "Yesterday", read: true },
];

export function OrganizerProvider({ children }) {
  const [organizerEvents, setOrganizerEvents] = useState(organizerEventData);
  const [registrations] = useState(initialRegistrations);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [notifications, setNotifications] = useState(initialNotifications);

  const addEvent = (event) => {
    const newEvent = { ...event, id: Date.now(), registrationCount: 0 };
    setOrganizerEvents((current) => [newEvent, ...current]);
    return newEvent;
  };

  const updateEvent = (eventId, updates) => {
    setOrganizerEvents((current) =>
      current.map((event) => String(event.id) === String(eventId) ? { ...event, ...updates } : event)
    );
  };

  const deleteEvent = (eventId) => {
    setOrganizerEvents((current) => current.filter((event) => String(event.id) !== String(eventId)));
  };

  const addAnnouncement = (announcement) => {
    setAnnouncements((current) => [{ ...announcement, id: Date.now() }, ...current]);
  };

  const updateAnnouncement = (announcementId, updates) => {
    setAnnouncements((current) =>
      current.map((item) => String(item.id) === String(announcementId) ? { ...item, ...updates } : item)
    );
  };

  const deleteAnnouncement = (announcementId) => {
    setAnnouncements((current) => current.filter((item) => String(item.id) !== String(announcementId)));
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications((current) =>
      current.map((item) => String(item.id) === String(notificationId) ? { ...item, read: true } : item)
    );
  };

  const value = useMemo(() => ({
    organizerEvents,
    registrations,
    announcements,
    notifications,
    addEvent,
    updateEvent,
    deleteEvent,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    markNotificationAsRead,
  }), [organizerEvents, registrations, announcements, notifications]);

  return <OrganizerContext.Provider value={value}>{children}</OrganizerContext.Provider>;
}

export function useOrganizer() {
  const context = useContext(OrganizerContext);
  if (!context) throw new Error("useOrganizer must be used inside OrganizerProvider");
  return context;
}
