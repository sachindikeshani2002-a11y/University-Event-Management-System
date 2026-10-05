import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock3, MapPin, UsersRound, Pencil, ClipboardList } from "lucide-react";
import OrganizerLayout from "../components/OrganizerLayout";
import { useOrganizer } from "../context/OrganizerContext";
import "./OrganizerEventDetails.css";

function formatEventDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function OrganizerEventDetails() {
  const { id } = useParams();
  const { organizerEvents } = useOrganizer();
  const event = organizerEvents.find((item) => String(item.id) === id);
  if (!event) return <Navigate to="/organizer/events" replace />;

  return (
    <OrganizerLayout>
      <div className="organizer-page">
        <header className="organizer-page-header">
          <div><Link className="organizer-back-link" to="/organizer/events"><ArrowLeft size={14} /> My Events</Link><span className="organizer-eyebrow">EVENT DETAILS</span><h1>{event.title}</h1><p>{event.category} · Event ID {event.id}</p></div>
          <div className="organizer-detail-actions"><Link className="organizer-button secondary" to={`/organizer/events/edit/${event.id}`}><Pencil size={15} />Edit Event</Link><Link className="organizer-button" to={`/organizer/registrations?event=${event.id}`}><ClipboardList size={15} />View Registrations</Link></div>
        </header>

        <div className="organizer-detail-grid">
          <section className="organizer-card organizer-detail-description"><span className={`organizer-status ${event.status.toLowerCase()}`}>{event.status}</span><h2>About this event</h2><p>{event.description}</p></section>
          <section className="organizer-card organizer-detail-facts">
            <h2>Event information</h2>
            <div><CalendarDays size={17} /><span><small>Date</small><strong>{formatEventDate(event.date)}</strong></span></div>
            <div><Clock3 size={17} /><span><small>Time</small><strong>{event.time}</strong></span></div>
            <div><MapPin size={17} /><span><small>Location</small><strong>{event.location}</strong></span></div>
            <div><UsersRound size={17} /><span><small>Registrations</small><strong>{event.registrationCount} of {event.maxParticipants} participants</strong></span></div>
          </section>
        </div>
      </div>
    </OrganizerLayout>
  );
}

export default OrganizerEventDetails;
