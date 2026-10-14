import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock3, MapPin, UsersRound, Check, X, Ban } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminConfirmDialog, AdminModal, AdminStatus } from "../components/AdminUi";
import { useAdmin } from "../context/AdminContext";
import "./AdminEventDetails.css";

function formatDate(value) { return new Date(`${String(value).slice(0, 10)}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }); }

function AdminEventDetails() {
  const { id } = useParams();
  const { events, isLoading, error, approveEvent, rejectEvent, deleteEvent } = useAdmin();
  const event = events.find((item) => String(item.id) === id);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  if (!event && isLoading) return <AdminLayout><div className="admin-page" role="status">Loading event...</div></AdminLayout>;
  if (!event) return <Navigate to="/admin/events" replace />;

  const runAction = async (action, ...args) => {
    setActionError("");
    try { await action(...args); setNotice("Event status updated."); }
    catch (failure) { setActionError(failure.message || "Unable to update this event."); }
  };

  return <AdminLayout><div className="admin-page">
    <header className="admin-page-header"><div><Link className="admin-back-link" to="/admin/events"><ArrowLeft size={13} /> Events</Link><span className="admin-eyebrow">SYSTEM EVENT DETAILS</span><h1>{event.title}</h1><p>{event.category} · Event ID {event.id}</p></div><div className="admin-page-header-action">{event.status === "Pending" && <><button type="button" className="admin-button approve" onClick={() => runAction(approveEvent, event.id)}><Check size={14} />Approve</button><button type="button" className="admin-button reject" onClick={() => { setReason(""); setRejecting(true); }}><X size={14} />Reject</button></>}{!['Cancelled', 'Completed'].includes(event.status) && <button type="button" className="admin-button danger" onClick={() => setCancelling(true)}><Ban size={14} />Cancel Event</button>}</div></header>
    {(notice || error || actionError) && <div className="admin-feedback" role={actionError || error ? "alert" : "status"}>{actionError || error || notice}</div>}
    <div className="admin-event-detail-grid">
      <section className="admin-card admin-event-description"><AdminStatus status={event.status} /><h2>About this event</h2><p>{event.description}</p>{event.rejectionReason && <div className="admin-rejection-note"><strong>Rejection reason</strong><p>{event.rejectionReason}</p></div>}</section>
      <section className="admin-card admin-event-facts"><h2>Event information</h2><div><CalendarDays size={16} /><span><small>Date</small><strong>{formatDate(event.date)}</strong></span></div><div><Clock3 size={16} /><span><small>Time</small><strong>{event.time || `${event.startTime}–${event.endTime}`}</strong></span></div><div><MapPin size={16} /><span><small>Location</small><strong>{event.location}</strong></span></div><div><UsersRound size={16} /><span><small>Capacity / registrations</small><strong>{event.capacity} places · {event.registrations} registered</strong></span></div><div><span className="admin-fact-spacer" /><span><small>Organizer</small><strong>{event.organizer}</strong></span></div><div><span className="admin-fact-spacer" /><span><small>Submitted</small><strong>{formatDate(event.submittedDate)}</strong></span></div></section>
    </div>
  </div>
  {rejecting && <AdminModal title="Reject event" onClose={() => setRejecting(false)}><p className="admin-modal-message">Enter a short reason to share with the event organizer.</p><div className="admin-form-field"><label htmlFor="event-reject-reason">Rejection reason</label><textarea id="event-reject-reason" className="admin-textarea" value={reason} maxLength={240} onChange={(e) => setReason(e.target.value)} required /></div><div className="admin-modal-actions"><button className="admin-button secondary" type="button" onClick={() => setRejecting(false)}>Cancel</button><button className="admin-button danger" type="button" disabled={!reason.trim()} onClick={async () => { await runAction(rejectEvent, event.id, reason.trim()); setRejecting(false); }}>Reject Event</button></div></AdminModal>}
  {cancelling && <AdminConfirmDialog title="Cancel event?" message={`Cancel ${event.title}? Registration history will be preserved.`} onCancel={() => setCancelling(false)} onConfirm={async () => { await runAction(deleteEvent, event.id); setCancelling(false); }} />}
  </AdminLayout>;
}

export default AdminEventDetails;
