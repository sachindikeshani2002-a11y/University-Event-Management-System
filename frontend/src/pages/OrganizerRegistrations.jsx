import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ClipboardList, UserCheck, CircleX, CheckCheck, Search } from "lucide-react";
import OrganizerLayout from "../components/OrganizerLayout";
import { useOrganizer } from "../context/OrganizerContext";
import "./OrganizerRegistrations.css";

function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function OrganizerRegistrations() {
  const { registrations, organizerEvents } = useOrganizer();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState(searchParams.get("event") || "All events");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const counts = {
    total: registrations.length,
    registered: registrations.filter((item) => item.status === "Registered").length,
    cancelled: registrations.filter((item) => item.status === "Cancelled").length,
    attended: registrations.filter((item) => item.status === "Attended").length,
  };
  const stats = [
    { label: "Total Registrations", value: counts.total, icon: ClipboardList },
    { label: "Registered", value: counts.registered, icon: UserCheck },
    { label: "Cancelled", value: counts.cancelled, icon: CircleX },
    { label: "Attended", value: counts.attended, icon: CheckCheck },
  ];
  const filtered = registrations.filter((item) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${item.studentName} ${item.studentId} ${item.email} ${item.eventTitle}`.toLowerCase().includes(query);
    const matchesEvent = eventFilter === "All events" || String(item.eventId) === eventFilter;
    const matchesStatus = statusFilter === "All statuses" || item.status === statusFilter;
    return matchesSearch && matchesEvent && matchesStatus;
  });

  return (
    <OrganizerLayout>
      <div className="organizer-page">
        <header className="organizer-page-header"><div><span className="organizer-eyebrow">ATTENDEE MANAGEMENT</span><h1>Registrations</h1><p>Review attendee details and registration status.</p></div></header>
        <section className="organizer-stat-grid organizer-registration-stats" aria-label="Registration summaries">
          {stats.map(({ label, value, icon: Icon }) => <article className="organizer-card organizer-stat-card" key={label}><span className="organizer-stat-icon"><Icon size={18} /></span><div className="organizer-stat-copy"><span>{label}</span><strong>{value}</strong></div></article>)}
        </section>
        <div className="organizer-toolbar">
          <label className="organizer-field-control search"><Search size={16} aria-hidden="true" /><input type="search" aria-label="Search registrations" placeholder="Search name, student ID, email, event" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <select className="organizer-select" aria-label="Filter registrations by event" value={eventFilter} onChange={(event) => setEventFilter(event.target.value)}><option>All events</option>{organizerEvents.map((event) => <option key={event.id} value={String(event.id)}>{event.title}</option>)}</select>
          <select className="organizer-select" aria-label="Filter registrations by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All statuses</option><option>Registered</option><option>Cancelled</option><option>Attended</option></select>
        </div>
        <section className="organizer-card organizer-section-card">
          <div className="organizer-section-heading"><div><h2>Event registrations</h2><p>{filtered.length} records</p></div></div>
          <div className="organizer-table-wrap"><table className="organizer-table organizer-registration-table">
            <thead><tr><th>Student</th><th>Event</th><th>Registered</th><th>Status</th></tr></thead>
            <tbody>{filtered.map((registration) => <tr key={registration.id}>
              <td><strong>{registration.studentName}</strong><span className="organizer-table-subtext">{registration.studentId} · {registration.email}</span></td>
              <td>{registration.eventTitle}</td><td>{formatDate(registration.registrationDate)}</td>
              <td><span className={`organizer-status ${registration.status.toLowerCase()}`}>{registration.status}</span></td>
            </tr>)}
              {!filtered.length && <tr><td colSpan="4"><div className="organizer-empty-state">No registrations match these filters.</div></td></tr>}
            </tbody>
          </table></div>
        </section>
      </div>
    </OrganizerLayout>
  );
}

export default OrganizerRegistrations;
