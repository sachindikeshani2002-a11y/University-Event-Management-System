import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Ban, Check, Eye, Search, X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminConfirmDialog, AdminModal, AdminPageHeader, AdminStatus } from "../components/AdminUi";
import { useAdmin } from "../context/AdminContext";
import "./AdminEvents.css";

function formatDate(value) { return new Date(`${String(value).slice(0, 10)}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }

function AdminEvents() {
  const { events, approveEvent, rejectEvent, deleteEvent, isLoading, error } = useAdmin();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");
  const [notice, setNotice] = useState("");
  const [cancelling, setCancelling] = useState(null);
  const filtered = useMemo(() => events.filter((event) => {
    const query = search.trim().toLowerCase();
    return (!query || `${event.title} ${event.organizer} ${event.location}`.toLowerCase().includes(query)) && (status === "All statuses" || event.status === status);
  }), [events, search, status]);

  const moderate = async (action, ...args) => {
    setNotice("");
    try {
      await action(...args);
      setNotice("Event status updated.");
    } catch (failure) {
      setNotice(failure.message || "Unable to update this event.");
    }
  };

  return <AdminLayout><div className="admin-page">
    <AdminPageHeader eyebrow="SYSTEM EVENT DIRECTORY" title="Events" description="Review submissions and manage event publication." />
    {notice && <div className="admin-feedback" role="status">{notice}</div>}
    {error && <p role="alert">{error}</p>}
    <div className="admin-toolbar"><label className="admin-search"><Search size={15} /><input aria-label="Search events" type="search" placeholder="Search event, organizer, location" value={search} onChange={(event) => setSearch(event.target.value)} /></label><select className="admin-select" aria-label="Filter events by status" value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option>{["Pending", "Published", "Draft", "Rejected", "Completed", "Cancelled"].map((item) => <option key={item}>{item}</option>)}</select></div>
    <section className="admin-card admin-section"><div className="admin-section-heading"><div><h2>All events</h2><p>{filtered.length} events{isLoading ? " · Updating..." : ""}</p></div></div><div className="admin-table-wrap"><table className="admin-table admin-events-table"><thead><tr><th>Event</th><th>Organizer</th><th>Date</th><th>Registrations</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      {filtered.map((item) => <tr key={item.id}><td><strong>{item.title}</strong><span className="admin-table-subtext">{item.category}</span></td><td>{item.organizer}</td><td>{formatDate(item.date)}</td><td>{item.registrations} / {item.capacity}</td><td><AdminStatus status={item.status} /></td><td><span className="admin-row-actions"><Link className="admin-icon-button" to={`/admin/events/${item.id}`} title="View" aria-label={`View ${item.title}`}><Eye size={15} /></Link>{item.status === "Pending" && <><button className="admin-icon-button" type="button" title="Approve" aria-label={`Approve ${item.title}`} onClick={() => moderate(approveEvent, item.id)}><Check size={15} /></button><button className="admin-icon-button danger" type="button" title="Reject" aria-label={`Reject ${item.title}`} onClick={() => setRejecting(item)}><X size={15} /></button></>}{!['Cancelled', 'Completed'].includes(item.status) && <button className="admin-icon-button danger" type="button" title="Cancel" aria-label={`Cancel ${item.title}`} onClick={() => setCancelling(item)}><Ban size={15} /></button>}</span></td></tr>)}
      {!filtered.length && <tr><td colSpan="6"><div className="admin-empty">{isLoading ? "Loading events..." : "No events match these filters."}</div></td></tr>}
    </tbody></table></div></section>
  </div>
  {rejecting && <AdminModal title="Reject event" onClose={() => setRejecting(null)}><div className="admin-form-field"><label htmlFor="admin-reason">Reason</label><textarea id="admin-reason" className="admin-textarea" maxLength={240} value={reason} onChange={(event) => setReason(event.target.value)} required /></div><div className="admin-modal-actions"><button type="button" className="admin-button secondary" onClick={() => setRejecting(null)}>Cancel</button><button type="button" className="admin-button danger" disabled={!reason.trim()} onClick={async () => { await moderate(rejectEvent, rejecting.id, reason); setRejecting(null); setReason(""); }}>Reject Event</button></div></AdminModal>}
  {cancelling && <AdminConfirmDialog title="Cancel event?" message={`Cancel ${cancelling.title}? Registration history will be preserved.`} onCancel={() => setCancelling(null)} onConfirm={async () => { await moderate(deleteEvent, cancelling.id); setCancelling(null); }} />}
  </AdminLayout>;
}

export default AdminEvents;
