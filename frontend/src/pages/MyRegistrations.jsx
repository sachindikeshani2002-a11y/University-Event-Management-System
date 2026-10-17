import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Users } from "lucide-react";
import StudentLayout from "../components/StudentLayout";
import { useStudent } from "../context/StudentContext";
import "./MyRegistrations.css";

function formatEventDate(value) {
  return new Date(`${String(value).slice(0, 10)}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function MyRegistrations() {
  const { registrations, isLoadingRegistrations, registrationError, cancelRegistration } = useStudent();
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState("");

  const handleCancel = async (registration) => {
    setCancelling(registration._id);
    setError("");
    setNotice("");
    try {
      await cancelRegistration(registration._id);
      setNotice("Your registration was cancelled.");
    } catch (reason) {
      setError(reason.message || "Unable to cancel this registration.");
    } finally {
      setCancelling("");
    }
  };

  return (
    <StudentLayout>
      <div className="page-shell">
        <div className="page-header"><div><h1>My Registrations</h1><p>Events you have signed up for.</p></div></div>
        {notice && <p role="status">{notice}</p>}
        {(error || registrationError) && <p role="alert">{error || registrationError}</p>}
        {isLoadingRegistrations ? <p role="status">Loading your registrations...</p> : registrations.length === 0 ? (
          <div className="empty-state-card"><h2>No registered events yet.</h2><p>Explore events and register for the ones you are interested in.</p><Link to="/events" className="primary-action-button">Browse Events</Link></div>
        ) : (
          <div className="list-grid">
            {registrations.map((registration) => {
              const event = registration.event;
              if (!event) return null;
              const eventId = event._id || event.id;
              return (
                <article className="info-card" key={registration._id}>
                  <div className="info-card-banner"><span>{event.category?.toUpperCase()}</span></div>
                  <div className="info-card-body">
                    <h2>{event.title}</h2>
                    <div className="info-meta"><span><CalendarDays size={15} />{formatEventDate(event.date)}</span><span><MapPin size={15} />{event.location}</span><span><Users size={15} />{event.capacity ? `${event.registrationCount || 0} / ${event.capacity}` : "Open capacity"}</span></div>
                    <p>{event.description}</p>
                    <p>Registration status: {registration.status}{event.status === "Cancelled" ? " · Event cancelled" : ""}</p>
                    <Link to={`/events?event=${eventId}`} className="secondary-link-button">View Event</Link>
                    {event.status !== "Cancelled" && <button type="button" className="secondary-link-button" disabled={cancelling === registration._id} onClick={() => handleCancel(registration)}>{cancelling === registration._id ? "Cancelling..." : "Cancel Registration"}</button>}
                    <span className="sr-only">Event ID {eventId}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default MyRegistrations;
