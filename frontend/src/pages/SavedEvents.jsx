import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, CalendarDays, MapPin, Users, Trash2 } from "lucide-react";
import StudentLayout from "../components/StudentLayout";
import { useAuth } from "../context/AuthContext";
import { useStudent } from "../context/StudentContext";
import "./SavedEvents.css";

function SavedEvents() {
  const { request } = useAuth();
  const { savedEvents, toggleSaveEvent } = useStudent();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    request("/api/events").then((result) => {
      if (active) setEvents((result.events || []).map((event) => ({ ...event, id: event._id || event.id, date: new Date(`${String(event.date).slice(0, 10)}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), participants: event.capacity ? `${event.registrationCount || 0} / ${event.capacity} participants` : `${event.registrationCount || 0} participants` })));
    }).catch((reason) => { if (active) setError(reason.message || "Unable to load saved events."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [request]);

  const savedEventDetails = events.filter((event) => savedEvents.includes(String(event.id)) || savedEvents.includes(event.id));
  return <StudentLayout><div className="page-shell">
    <div className="page-header"><div><h1>Saved Events</h1><p>Events you saved for later.</p></div></div>
    {error && <p role="alert">{error}</p>}
    {loading ? <p role="status">Loading saved events...</p> : savedEventDetails.length === 0 ? <div className="empty-state-card"><h2>No saved events yet.</h2><p>Save published events to find them here.</p><Link to="/events" className="primary-action-button">Explore Events</Link></div> : (
      <div className="list-grid">{savedEventDetails.map((event) => <article className="info-card" key={event.id}>
        <div className="info-card-banner"><span>{event.category?.toUpperCase()}</span><button type="button" className="remove-save-button" onClick={() => toggleSaveEvent(String(event.id))} aria-label={`Remove ${event.title} from saved events`}><Trash2 size={16} /></button></div>
        <div className="info-card-body"><h2>{event.title}</h2><div className="info-meta"><span><CalendarDays size={15} />{event.date}</span><span><MapPin size={15} />{event.location}</span><span><Users size={15} />{event.participants}</span></div><p>{event.description}</p><div className="card-actions"><Link to={`/events?event=${event.id}`} className="secondary-link-button">View Event</Link><button type="button" className="link-button danger-button" onClick={() => toggleSaveEvent(String(event.id))}><Bookmark size={15} />Remove</button></div></div>
      </article>)}</div>
    )}
  </div></StudentLayout>;
}

export default SavedEvents;
