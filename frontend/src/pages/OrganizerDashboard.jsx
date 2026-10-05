import { Link } from "react-router-dom";
import {
  CalendarDays,
  CircleCheck,
  UsersRound,
  CalendarClock,
  ArrowUpRight,
  Plus,
  Eye,
  Pencil,
} from "lucide-react";
import OrganizerLayout from "../components/OrganizerLayout";
import { useOrganizer } from "../context/OrganizerContext";
import "./OrganizerDashboard.css";

const statisticIcons = [CalendarDays, CircleCheck, UsersRound, CalendarClock];

function formatEventDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function OrganizerDashboard() {
  const { organizerEvents } = useOrganizer();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = organizerEvents
    .filter((event) => event.date >= today && event.status === "Published")
    .sort((first, second) => first.date.localeCompare(second.date));
  const stats = [
    { label: "Total Events", value: organizerEvents.length },
    { label: "Published Events", value: organizerEvents.filter((event) => event.status === "Published").length },
    { label: "Total Registrations", value: organizerEvents.reduce((total, event) => total + Number(event.registrationCount || 0), 0).toLocaleString() },
    { label: "Upcoming Events", value: upcoming.length },
  ];

  return (
    <OrganizerLayout>
      <div className="organizer-page organizer-dashboard-page">
        <section className="organizer-welcome">
          <div>
            <span className="organizer-eyebrow">ORGANIZER WORKSPACE</span>
            <h1>Welcome back, Alex!</h1>
            <p>Manage your events, registrations, and university activities from one place.</p>
          </div>
          <Link className="organizer-button" to="/organizer/events/create">
            <Plus size={16} aria-hidden="true" /> Create Event
          </Link>
        </section>

        <section className="organizer-stat-grid" aria-label="Event statistics">
          {stats.map((stat, index) => {
            const Icon = statisticIcons[index];
            return (
              <article className="organizer-card organizer-stat-card" key={stat.label}>
                <span className="organizer-stat-icon"><Icon size={19} aria-hidden="true" /></span>
                <div className="organizer-stat-copy">
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              </article>
            );
          })}
        </section>

        <section className="organizer-card organizer-section-card organizer-upcoming-card">
          <div className="organizer-section-heading">
            <div>
              <h2>Upcoming Events</h2>
              <p>Published events scheduled next</p>
            </div>
            <Link className="organizer-text-link" to="/organizer/events">All events <ArrowUpRight size={14} /></Link>
          </div>
          <div className="organizer-table-wrap">
            <table className="organizer-table">
              <thead>
                <tr><th>Event</th><th>Date &amp; time</th><th>Registrations</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {upcoming.slice(0, 5).map((event) => (
                  <tr key={event.id}>
                    <td><strong>{event.title}</strong><span className="organizer-table-subtext">{event.category} · {event.location}</span></td>
                    <td>{formatEventDate(event.date)}<span className="organizer-table-subtext">{event.time}</span></td>
                    <td>{event.registrationCount.toLocaleString()} / {event.maxParticipants}</td>
                    <td><span className={`organizer-status ${event.status.toLowerCase()}`}>{event.status}</span></td>
                    <td>
                      <span className="organizer-row-actions">
                        <Link className="organizer-icon-button" to={`/organizer/events/${event.id}`} aria-label={`View ${event.title}`} title="View"><Eye size={16} /></Link>
                        <Link className="organizer-icon-button" to={`/organizer/events/edit/${event.id}`} aria-label={`Edit ${event.title}`} title="Edit"><Pencil size={15} /></Link>
                      </span>
                    </td>
                  </tr>
                ))}
                {!upcoming.length && <tr><td colSpan="5"><div className="organizer-empty-state">No upcoming published events.</div></td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </OrganizerLayout>
  );
}

export default OrganizerDashboard;
