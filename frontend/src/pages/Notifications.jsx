import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import StudentLayout from "../components/StudentLayout";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import "./Notifications.css";

function Notifications() {
  const { request } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    request("/api/announcements").then((result) => { if (active) setAnnouncements(result.announcements || []); })
      .catch((reason) => { if (active) setError(reason.message || "Unable to load announcements."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [request]);

  return <StudentLayout><div className="page-shell">
    <div className="page-header"><div><h1>Notifications</h1><p>Published updates for students.</p></div></div>
    {error && <p role="alert">{error}</p>}
    <div className="notifications-card">{loading ? <p role="status">Loading updates...</p> : announcements.map((announcement) => <article className="notification-item" key={announcement._id}><div className="notification-icon"><Bell size={16} /></div><div className="notification-copy"><strong>{announcement.title}</strong><p>{announcement.message}</p><small>{new Date(announcement.date).toLocaleDateString()}</small></div></article>)}{!loading && !error && !announcements.length && <EmptyState title="No published announcements." />}</div>
  </div></StudentLayout>;
}

export default Notifications;
