import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock3, MapPin, UsersRound, Pencil, Trash2, Check, X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminConfirmDialog, AdminModal, AdminStatus } from "../components/AdminUi";
import { useAdmin } from "../context/AdminContext";
import "./AdminEventDetails.css";

function formatDate(value) { return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }); }

function AdminEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, updateEvent, deleteEvent, approveEvent, rejectEvent } = useAdmin();
  const event = events.find((item) => String(item.id) === id);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState("");
  if (!event) return <Navigate to="/admin/events" replace />;

  const startEdit = () => { setDraft({ ...event }); setEditing(true); };
  const saveEdit = (submitEvent) => { submitEvent.preventDefault(); updateEvent(event.id, draft); setNotice("Event updated."); setEditing(false); };
  const confirmReject = () => { rejectEvent(event.id, reason.trim()); setNotice("Event rejected."); setRejecting(false); setReason(""); };
  const confirmDelete = () => { deleteEvent(event.id); navigate("/admin/events"); };

  return <AdminLayout><div className="admin-page">
    <header className="admin-page-header"><div><Link className="admin-back-link" to="/admin/events"><ArrowLeft size={13} /> Events</Link><span className="admin-eyebrow">SYSTEM EVENT DETAILS</span><h1>{event.title}</h1><p>{event.category} · Event ID {event.id}</p></div><div className="admin-page-header-action"><button type="button" className="admin-button secondary" onClick={startEdit}><Pencil size={14} />Edit</button>{event.status === "Pending" && <><button type="button" className="admin-button approve" onClick={() => { approveEvent(event.id); setNotice("Event approved and published."); }}><Check size={14} />Approve</button><button type="button" className="admin-button reject" onClick={() => { setReason(""); setRejecting(true); }}><X size={14} />Reject</button></>}<button type="button" className="admin-button danger" onClick={() => setDeleting(true)}><Trash2 size={14} />Delete</button></div></header>
    {notice && <div className="admin-feedback" role="status">{notice}<button type="button" className="admin-feedback-dismiss" onClick={() => setNotice("")} aria-label="Dismiss">×</button></div>}
    <div className="admin-event-detail-grid">
      <section className="admin-card admin-event-description"><AdminStatus status={event.status} /><h2>About this event</h2><p>{event.description}</p>{event.rejectionReason && <div className="admin-rejection-note"><strong>Rejection reason</strong><p>{event.rejectionReason}</p></div>}</section>
      <section className="admin-card admin-event-facts"><h2>Event information</h2><div><CalendarDays size={16} /><span><small>Date</small><strong>{formatDate(event.date)}</strong></span></div><div><Clock3 size={16} /><span><small>Time</small><strong>{event.time}</strong></span></div><div><MapPin size={16} /><span><small>Location</small><strong>{event.location}</strong></span></div><div><UsersRound size={16} /><span><small>Capacity / registrations</small><strong>{event.capacity} places · {event.registrations} registered</strong></span></div><div><span className="admin-fact-spacer" /><span><small>Organizer</small><strong>{event.organizer}</strong></span></div><div><span className="admin-fact-spacer" /><span><small>Created</small><strong>{formatDate(event.createdDate)}</strong></span></div></section>
    </div>
  </div>
  {editing && <AdminModal title="Edit event" onClose={() => setEditing(false)}><form onSubmit={saveEdit}><div className="admin-form-grid"><div className="admin-form-field full"><label htmlFor="detail-title">Title</label><input id="detail-title" className="admin-input" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required /></div><div className="admin-form-field full"><label htmlFor="detail-description">Description</label><textarea id="detail-description" className="admin-textarea" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} required /></div><div className="admin-form-field"><label htmlFor="detail-category">Category</label><input id="detail-category" className="admin-input" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} required /></div><div className="admin-form-field"><label htmlFor="detail-date">Date</label><input id="detail-date" type="date" className="admin-input" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} required /></div><div className="admin-form-field"><label htmlFor="detail-time">Time</label><input id="detail-time" className="admin-input" value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} required /></div><div className="admin-form-field"><label htmlFor="detail-location">Location</label><input id="detail-location" className="admin-input" value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} required /></div><div className="admin-form-field"><label htmlFor="detail-capacity">Capacity</label><input id="detail-capacity" type="number" min="1" className="admin-input" value={draft.capacity} onChange={(e) => setDraft({ ...draft, capacity: Number(e.target.value) })} /></div><div className="admin-form-field"><label htmlFor="detail-status">Status</label><select id="detail-status" className="admin-input" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>{["Published", "Draft", "Pending", "Rejected", "Completed"].map((status) => <option key={status}>{status}</option>)}</select></div></div><div className="admin-modal-actions"><button className="admin-button secondary" type="button" onClick={() => setEditing(false)}>Cancel</button><button className="admin-button" type="submit">Save Changes</button></div></form></AdminModal>}
  {rejecting && <AdminModal title="Reject event" onClose={() => setRejecting(false)}><p className="admin-modal-message">Enter a short reason to share with the event organizer.</p><div className="admin-form-field"><label htmlFor="event-reject-reason">Rejection reason <span>*</span></label><textarea id="event-reject-reason" className="admin-textarea" value={reason} maxLength={240} onChange={(e) => setReason(e.target.value)} required /></div><div className="admin-modal-actions"><button className="admin-button secondary" type="button" onClick={() => setRejecting(false)}>Cancel</button><button className="admin-button danger" type="button" disabled={!reason.trim()} onClick={confirmReject}>Reject Event</button></div></AdminModal>}
  {deleting && <AdminConfirmDialog title="Delete event?" message={`Delete ${event.title} from the system?`} onCancel={() => setDeleting(false)} onConfirm={confirmDelete} />}
  </AdminLayout>;
}

export default AdminEventDetails;
