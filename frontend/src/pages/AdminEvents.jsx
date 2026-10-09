import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminConfirmDialog, AdminModal, AdminPageHeader, AdminStatus } from "../components/AdminUi";
import { useAdmin } from "../context/AdminContext";
import "./AdminEvents.css";

function formatDate(value) { return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
const emptyFilters = { search: "", category: "All categories", status: "All statuses" };

function AdminEvents() {
  const { events, updateEvent, deleteEvent } = useAdmin();
  const [filters, setFilters] = useState(emptyFilters);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [notice, setNotice] = useState("");
  const categories = [...new Set(events.map((event) => event.category))].sort();
  const filtered = useMemo(() => events.filter((event) => {
    const query = filters.search.trim().toLowerCase();
    return (!query || `${event.title} ${event.organizer} ${event.location}`.toLowerCase().includes(query)) && (filters.category === "All categories" || event.category === filters.category) && (filters.status === "All statuses" || event.status === filters.status);
  }), [events, filters]);
  const saveEdit = (event) => { event.preventDefault(); updateEvent(editing.id, editing); setNotice("Event updated."); setEditing(null); };
  const confirmDelete = () => { deleteEvent(deleting.id); setNotice(`${deleting.title} deleted.`); setDeleting(null); };

  return <AdminLayout><div className="admin-page">
    <AdminPageHeader eyebrow="SYSTEM EVENT DIRECTORY" title="Events" description="Review and manage events submitted across the university." />
    {notice && <div className="admin-feedback" role="status">{notice}<button className="admin-feedback-dismiss" type="button" aria-label="Dismiss" onClick={() => setNotice("")}>×</button></div>}
    <div className="admin-toolbar"><label className="admin-search"><Search size={15} /><input aria-label="Search events" type="search" placeholder="Search event, organizer, location" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} /></label><select className="admin-select" aria-label="Filter events by category" value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}><option>All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select><select className="admin-select" aria-label="Filter events by status" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option>All statuses</option><option>Published</option><option>Draft</option><option>Pending</option><option>Rejected</option><option>Completed</option></select></div>
    <section className="admin-card admin-section"><div className="admin-section-heading"><div><h2>All events</h2><p>{filtered.length} of {events.length} events</p></div></div><div className="admin-table-wrap"><table className="admin-table admin-events-table"><thead><tr><th>Event</th><th>Organizer</th><th>Date</th><th>Registrations</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      {filtered.map((item) => <tr key={item.id}><td><strong>{item.title}</strong><span className="admin-table-subtext">{item.category}</span></td><td>{item.organizer}</td><td>{formatDate(item.date)}</td><td>{item.registrations} / {item.capacity}</td><td><AdminStatus status={item.status} /></td><td><span className="admin-row-actions"><Link className="admin-icon-button" to={`/admin/events/${item.id}`} title="View" aria-label={`View ${item.title}`}><Eye size={15} /></Link><button className="admin-icon-button" type="button" title="Edit" aria-label={`Edit ${item.title}`} onClick={() => setEditing({ ...item })}><Pencil size={14} /></button><button className="admin-icon-button danger" type="button" title="Delete" aria-label={`Delete ${item.title}`} onClick={() => setDeleting(item)}><Trash2 size={14} /></button></span></td></tr>)}
      {!filtered.length && <tr><td colSpan="6"><div className="admin-empty">No events match these filters.</div></td></tr>}
    </tbody></table></div></section>
  </div>
  {editing && <AdminModal title="Edit event" onClose={() => setEditing(null)}><form onSubmit={saveEdit}><div className="admin-form-grid"><div className="admin-form-field full"><label htmlFor="admin-event-title">Title</label><input id="admin-event-title" className="admin-input" value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value })} required /></div><div className="admin-form-field"><label htmlFor="admin-event-organizer">Organizer</label><input id="admin-event-organizer" className="admin-input" value={editing.organizer} onChange={(event) => setEditing({ ...editing, organizer: event.target.value })} required /></div><div className="admin-form-field"><label htmlFor="admin-event-category">Category</label><input id="admin-event-category" className="admin-input" value={editing.category} onChange={(event) => setEditing({ ...editing, category: event.target.value })} required /></div><div className="admin-form-field"><label htmlFor="admin-event-date">Date</label><input id="admin-event-date" type="date" className="admin-input" value={editing.date} onChange={(event) => setEditing({ ...editing, date: event.target.value })} required /></div><div className="admin-form-field"><label htmlFor="admin-event-status">Status</label><select id="admin-event-status" className="admin-input" value={editing.status} onChange={(event) => setEditing({ ...editing, status: event.target.value })}>{["Published", "Draft", "Pending", "Rejected", "Completed"].map((status) => <option key={status}>{status}</option>)}</select></div><div className="admin-form-field full"><label htmlFor="admin-event-location">Location</label><input id="admin-event-location" className="admin-input" value={editing.location} onChange={(event) => setEditing({ ...editing, location: event.target.value })} required /></div></div><div className="admin-modal-actions"><button className="admin-button secondary" type="button" onClick={() => setEditing(null)}>Cancel</button><button className="admin-button" type="submit">Save Changes</button></div></form></AdminModal>}
  {deleting && <AdminConfirmDialog title="Delete event?" message={`Delete ${deleting.title} from the system?`} onCancel={() => setDeleting(null)} onConfirm={confirmDelete} />}
  </AdminLayout>;
}

export default AdminEvents;
