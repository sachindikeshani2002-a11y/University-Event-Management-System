import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Eye, Search, X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminModal, AdminPageHeader, AdminStatus } from "../components/AdminUi";
import { useAdmin } from "../context/AdminContext";
import "./AdminEventApprovals.css";

function formatDate(value) { return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }

function AdminEventApprovals() {
  const { events, approveEvent, rejectEvent } = useAdmin();
  const [search, setSearch] = useState("");
  const [reviewing, setReviewing] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");
  const [notice, setNotice] = useState("");
  const pending = useMemo(() => events.filter((event) => event.status === "Pending" && (!search.trim() || `${event.title} ${event.organizer} ${event.category}`.toLowerCase().includes(search.trim().toLowerCase()))), [events, search]);
  const confirmReject = (event) => { rejectEvent(event.id, reason.trim()); setNotice(`${event.title} rejected.`); setRejecting(null); setReason(""); };
  const confirmApprove = (event) => { approveEvent(event.id); setNotice(`${event.title} approved and published.`); setReviewing(null); };

  return <AdminLayout><div className="admin-page">
    <AdminPageHeader eyebrow="REVIEW QUEUE" title="Event Approvals" description="Review organizer submissions before they are published." />
    {notice && <div className="admin-feedback" role="status">{notice}<button className="admin-feedback-dismiss" type="button" aria-label="Dismiss" onClick={() => setNotice("")}>×</button></div>}
    <div className="admin-toolbar"><label className="admin-search"><Search size={15} /><input aria-label="Search pending approvals" type="search" placeholder="Search event or organizer" value={search} onChange={(event) => setSearch(event.target.value)} /></label><span className="admin-approval-count">{pending.length} pending review</span></div>
    <section className="admin-card admin-section"><div className="admin-table-wrap"><table className="admin-table admin-approvals-table"><thead><tr><th>Event</th><th>Organizer</th><th>Date &amp; location</th><th>Submitted</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      {pending.map((event) => <tr key={event.id}><td><strong>{event.title}</strong><span className="admin-table-subtext">{event.category}</span></td><td>{event.organizer}</td><td>{formatDate(event.date)}<span className="admin-table-subtext">{event.location}</span></td><td>{formatDate(event.submittedDate)}</td><td><AdminStatus status={event.status} /></td><td><span className="admin-row-actions"><button className="admin-icon-button" type="button" aria-label={`Review ${event.title}`} title="Review" onClick={() => setReviewing(event)}><Eye size={15} /></button><button className="admin-icon-button approve" type="button" aria-label={`Approve ${event.title}`} title="Approve" onClick={() => confirmApprove(event)}><Check size={15} /></button><button className="admin-icon-button danger" type="button" aria-label={`Reject ${event.title}`} title="Reject" onClick={() => { setRejecting(event); setReason(""); }}><X size={15} /></button></span></td></tr>)}
      {!pending.length && <tr><td colSpan="6"><div className="admin-empty">No pending events need review.</div></td></tr>}
    </tbody></table></div></section>
  </div>
  {reviewing && <AdminModal title="Review event" onClose={() => setReviewing(null)}><div className="admin-review-summary"><div><span>Event</span><strong>{reviewing.title}</strong></div><div><span>Organizer</span><strong>{reviewing.organizer}</strong></div><div><span>Category</span><strong>{reviewing.category}</strong></div><div><span>Date</span><strong>{formatDate(reviewing.date)}</strong></div><div><span>Location</span><strong>{reviewing.location}</strong></div><div><span>Submitted</span><strong>{formatDate(reviewing.submittedDate)}</strong></div></div><p className="admin-review-description">{reviewing.description}</p><div className="admin-modal-actions"><Link className="admin-button secondary" to={`/admin/events/${reviewing.id}`} onClick={() => setReviewing(null)}>Full details</Link><button className="admin-button reject" type="button" onClick={() => { setRejecting(reviewing); setReviewing(null); }}>Reject</button><button className="admin-button approve" type="button" onClick={() => confirmApprove(reviewing)}>Approve</button></div></AdminModal>}
  {rejecting && <AdminModal title="Reject event" onClose={() => { setRejecting(null); setReason(""); }}><p className="admin-modal-message">Add a short reason for rejecting <strong>{rejecting.title}</strong>.</p><div className="admin-form-field"><label htmlFor="rejection-reason">Rejection reason <span>*</span></label><textarea id="rejection-reason" className="admin-textarea" maxLength={240} required value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Explain what needs to be updated." /></div><div className="admin-modal-actions"><button className="admin-button secondary" type="button" onClick={() => setRejecting(null)}>Cancel</button><button className="admin-button danger" type="button" disabled={!reason.trim()} onClick={() => confirmReject(rejecting)}>Reject Event</button></div></AdminModal>}
  </AdminLayout>;
}

export default AdminEventApprovals;
