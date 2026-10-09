import { useState } from "react";
import { Link } from "react-router-dom";
import { UsersRound, GraduationCap, BriefcaseBusiness, CalendarDays, BadgeCheck, ClipboardList, Eye, Check, X, ArrowRight } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminConfirmDialog, AdminStatus, AdminPageHeader } from "../components/AdminUi";
import { useAdmin } from "../context/AdminContext";
import "./AdminDashboard.css";

function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function AdminDashboard() {
  const { users, students, organizers, events, registrations, approveEvent, rejectEvent } = useAdmin();
  const [notice, setNotice] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);
  const pending = events.filter((event) => event.status === "Pending");
  const stats = [
    { label: "Total Users", value: users.length, icon: UsersRound, tone: "blue" },
    { label: "Total Students", value: students.length, icon: GraduationCap, tone: "green" },
    { label: "Total Organizers", value: organizers.length, icon: BriefcaseBusiness, tone: "blue" },
    { label: "Total Events", value: events.length, icon: CalendarDays, tone: "green" },
    { label: "Pending Event Approvals", value: pending.length, icon: BadgeCheck, tone: "amber" },
    { label: "Total Registrations", value: registrations.length, icon: ClipboardList, tone: "blue" },
  ];
  const rejectEventFromDashboard = (eventId) => {
    rejectEvent(eventId, "Please review the event submission details and resubmit.");
    setNotice("Event rejected and activity recorded.");
    setRejectTarget(null);
  };
  const approveEventFromDashboard = (event) => {
    approveEvent(event.id);
    setNotice(`${event.title} approved and published.`);
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <AdminPageHeader eyebrow="SYSTEM OVERVIEW" title="Admin Dashboard" description="Monitor and manage the university event management system." />
        {notice && <div className="admin-feedback" role="status">{notice}<button className="admin-feedback-dismiss" type="button" aria-label="Dismiss message" onClick={() => setNotice("")}>×</button></div>}
        <section className="admin-stat-grid" aria-label="System statistics">
          {stats.map(({ label, value, icon: Icon, tone }) => <article className="admin-card admin-stat-card" key={label}><span className={`admin-stat-icon ${tone}`}><Icon size={17} aria-hidden="true" /></span><div className="admin-stat-copy"><span>{label}</span><strong>{value.toLocaleString()}</strong></div></article>)}
        </section>

        <div className="admin-overview-grid">
          <div className="admin-overview-column">
            <section className="admin-card admin-section">
              <div className="admin-section-heading"><div><h2>Recent Events</h2><p>Latest events across the system</p></div><Link className="admin-text-link" to="/admin/events">All events <ArrowRight size={12} /></Link></div>
              <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Event</th><th>Organizer</th><th>Date</th><th>Status</th></tr></thead><tbody>
                {events.slice(0, 4).map((event) => <tr key={event.id}><td><strong>{event.title}</strong><span className="admin-table-subtext">{event.category}</span></td><td>{event.organizer}</td><td>{formatDate(event.date)}</td><td><AdminStatus status={event.status} /></td></tr>)}
              </tbody></table></div>
            </section>
            <section className="admin-card admin-section">
              <div className="admin-section-heading"><div><h2>Recent Registrations</h2><p>Latest attendee activity</p></div><Link className="admin-text-link" to="/admin/registrations">All registrations <ArrowRight size={12} /></Link></div>
              <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Student</th><th>Event</th><th>Date</th><th>Status</th></tr></thead><tbody>
                {registrations.slice(0, 4).map((registration) => <tr key={registration.id}><td><strong>{registration.student}</strong><span className="admin-table-subtext">{registration.studentId}</span></td><td>{registration.event}</td><td>{formatDate(registration.date)}</td><td><AdminStatus status={registration.status} /></td></tr>)}
              </tbody></table></div>
            </section>
          </div>

          <section className="admin-card admin-section admin-pending-section">
            <div className="admin-section-heading"><div><h2>Pending Approvals</h2><p>{pending.length} events need review</p></div><Link className="admin-text-link" to="/admin/event-approvals">Review queue <ArrowRight size={12} /></Link></div>
            <div className="admin-pending-list">
              {pending.map((event) => <article className="admin-pending-item" key={event.id}>
                <div className="admin-pending-title"><div><strong>{event.title}</strong><span>{event.organizer} · {formatDate(event.submittedDate)}</span></div><AdminStatus status={event.status} /></div>
                <p>{event.category} · {event.location}</p>
                <div className="admin-pending-actions"><Link className="admin-icon-button" to={`/admin/events/${event.id}`} aria-label={`Review ${event.title}`} title="Review"><Eye size={15} /></Link><button className="admin-button approve" type="button" onClick={() => approveEventFromDashboard(event)}><Check size={13} />Approve</button><button className="admin-button reject" type="button" onClick={() => setRejectTarget(event)}><X size={13} />Reject</button></div>
              </article>)}
              {!pending.length && <div className="admin-empty">No events awaiting approval.</div>}
            </div>
          </section>
        </div>
      </div>
      {rejectTarget && <AdminConfirmDialog title="Reject event?" message={`Reject ${rejectTarget.title}? A standard review reason will be recorded.`} confirmLabel="Reject Event" onCancel={() => setRejectTarget(null)} onConfirm={() => rejectEventFromDashboard(rejectTarget.id)} />}
    </AdminLayout>
  );
}

export default AdminDashboard;
