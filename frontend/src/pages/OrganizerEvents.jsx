import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, Search, Eye, Pencil, Ban } from "lucide-react";
import OrganizerLayout from "../components/OrganizerLayout";
import { useOrganizer } from "../context/OrganizerContext";
import "./OrganizerEvents.css";

function formatEventDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function OrganizerEvents() {
  const { organizerEvents, deleteEvent, isLoadingEvents, error: loadError } = useOrganizer();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState(location.state?.notice || "");
  const [error, setError] = useState("");

  const categories = useMemo(
    () => [...new Set(organizerEvents.map((event) => event.category))].sort(),
    [organizerEvents]
  );
  const filteredEvents = organizerEvents.filter((event) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${event.title} ${event.category} ${event.location}`.toLowerCase().includes(query);
    const matchesStatus = statusFilter === "All statuses" || event.status === statusFilter;
    const matchesCategory = categoryFilter === "All categories" || event.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setError("");
    try {
      await deleteEvent(deleteTarget.id);
      setNotice(`${deleteTarget.title} was cancelled. Its registration history is preserved.`);
      setDeleteTarget(null);
    } catch (reason) {
      setError(reason.message || "Unable to cancel this event.");
    }
  };

  return (
    <OrganizerLayout>
      <div className="organizer-page">
        <header className="organizer-page-header">
          <div><span className="organizer-eyebrow">EVENT MANAGEMENT</span><h1>My Events</h1><p>Manage event details, visibility, and registrations.</p></div>
          <Link className="organizer-button" to="/organizer/events/create"><Plus size={16} />Create Event</Link>
        </header>

        {notice && <div className="organizer-feedback" role="status">{notice}<button type="button" className="organizer-notice-dismiss" onClick={() => setNotice("")} aria-label="Dismiss message">×</button></div>}
        {error && <div className="organizer-feedback" role="alert">{error}</div>}
        {loadError && <div className="organizer-feedback" role="alert">{loadError}</div>}
        {isLoadingEvents && <p role="status">Loading events...</p>}

        <div className="organizer-toolbar">
          <label className="organizer-field-control search"><Search size={16} aria-hidden="true" /><input aria-label="Search events" type="search" placeholder="Search title, category, or location" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <select className="organizer-select" aria-label="Filter events by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option>All statuses</option><option>Pending</option><option>Published</option><option>Draft</option><option>Rejected</option><option>Completed</option><option>Cancelled</option>
          </select>
          <select className="organizer-select" aria-label="Filter events by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option>All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </div>

        <section className="organizer-card organizer-section-card">
          <div className="organizer-section-heading"><div><h2>All events</h2><p>{filteredEvents.length} of {organizerEvents.length} events</p></div></div>
          <div className="organizer-table-wrap">
            <table className="organizer-table organizer-events-table">
              <thead><tr><th>Event</th><th>Date</th><th>Location</th><th>Registrations</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td><strong>{event.title}</strong><span className="organizer-table-subtext">{event.category}</span></td>
                    <td>{formatEventDate(event.date)}</td>
                    <td>{event.location}</td>
                    <td>{Number(event.registrationCount || 0).toLocaleString()}<span className="organizer-table-subtext">{event.maxParticipants ? `of ${event.maxParticipants} places` : "No capacity limit"}</span></td>
                    <td><span className={`organizer-status ${event.status.toLowerCase()}`}>{event.status}</span></td>
                    <td><span className="organizer-row-actions">
                      <Link className="organizer-icon-button" to={`/organizer/events/${event.id}`} aria-label={`View ${event.title}`} title="View"><Eye size={16} /></Link>
                      <Link className="organizer-icon-button" to={`/organizer/events/edit/${event.id}`} aria-label={`Edit ${event.title}`} title="Edit"><Pencil size={15} /></Link>
                      {!['Cancelled', 'Completed'].includes(event.status) && <button className="organizer-icon-button danger" type="button" onClick={() => setDeleteTarget(event)} aria-label={`Cancel ${event.title}`} title="Cancel event"><Ban size={15} /></button>}
                    </span></td>
                  </tr>
                ))}
                {!filteredEvents.length && <tr><td colSpan="6"><div className="organizer-empty-state">No events match these filters.</div></td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {deleteTarget && <div className="organizer-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteTarget(null); }}>
        <section className="organizer-modal" role="dialog" aria-modal="true" aria-labelledby="delete-event-title">
          <h2 id="delete-event-title">Cancel event?</h2>
          <p>Cancel “{deleteTarget.title}”? Its registration records will be retained for history.</p>
          <div className="organizer-modal-actions"><button type="button" className="organizer-button secondary" onClick={() => setDeleteTarget(null)}>Keep Event</button><button type="button" className="organizer-button danger" onClick={confirmDelete}>Cancel Event</button></div>
        </section>
      </div>}
    </OrganizerLayout>
  );
}

export default OrganizerEvents;
