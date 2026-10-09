import { useMemo, useState } from "react";
import { ClipboardList, UserCheck, CircleX, CheckCheck, Search } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminPageHeader, AdminStatus } from "../components/AdminUi";
import { useAdmin } from "../context/AdminContext";
import "./AdminRegistrations.css";

function formatDate(value) { return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }

function AdminRegistrations() {
  const { registrations, events } = useAdmin();
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("All events");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [dateFilter, setDateFilter] = useState("");
  const statuses = ["Registered", "Cancelled", "Attended"];
  const summaries = [
    { label: "Total Registrations", value: registrations.length, icon: ClipboardList, tone: "blue" },
    { label: "Registered", value: registrations.filter((item) => item.status === "Registered").length, icon: UserCheck, tone: "green" },
    { label: "Cancelled", value: registrations.filter((item) => item.status === "Cancelled").length, icon: CircleX, tone: "red" },
    { label: "Attended", value: registrations.filter((item) => item.status === "Attended").length, icon: CheckCheck, tone: "blue" },
  ];
  const filtered = useMemo(() => registrations.filter((item) => {
    const query = search.trim().toLowerCase();
    return (!query || `${item.student} ${item.studentId} ${item.event} ${item.organizer}`.toLowerCase().includes(query)) && (eventFilter === "All events" || String(item.eventId) === eventFilter) && (statusFilter === "All statuses" || item.status === statusFilter) && (!dateFilter || item.date === dateFilter);
  }), [registrations, search, eventFilter, statusFilter, dateFilter]);

  return <AdminLayout><div className="admin-page">
    <AdminPageHeader eyebrow="UNIVERSITY PARTICIPATION" title="Registrations" description="Review attendee activity across every event." />
    <section className="admin-stat-grid admin-registration-stats">{summaries.map(({ label, value, icon: Icon, tone }) => <article className="admin-card admin-stat-card" key={label}><span className={`admin-stat-icon ${tone}`}><Icon size={17} /></span><div className="admin-stat-copy"><span>{label}</span><strong>{value}</strong></div></article>)}</section>
    <div className="admin-toolbar"><label className="admin-search"><Search size={15} /><input type="search" aria-label="Search registrations" placeholder="Search student, ID, event, or organizer" value={search} onChange={(event) => setSearch(event.target.value)} /></label><select className="admin-select" aria-label="Filter registrations by event" value={eventFilter} onChange={(event) => setEventFilter(event.target.value)}><option>All events</option>{events.map((event) => <option key={event.id} value={String(event.id)}>{event.title}</option>)}</select><select className="admin-select" aria-label="Filter registrations by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select><input className="admin-date-filter" type="date" aria-label="Filter registrations by date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} /></div>
    <section className="admin-card admin-section"><div className="admin-section-heading"><div><h2>All registrations</h2><p>{filtered.length} records</p></div></div><div className="admin-table-wrap"><table className="admin-table admin-registration-table"><thead><tr><th>Student</th><th>Event</th><th>Organizer</th><th>Registration date</th><th>Status</th></tr></thead><tbody>
      {filtered.map((item) => <tr key={item.id}><td><strong>{item.student}</strong><span className="admin-table-subtext">{item.studentId}</span></td><td>{item.event}</td><td>{item.organizer}</td><td>{formatDate(item.date)}</td><td><AdminStatus status={item.status} /></td></tr>)}
      {!filtered.length && <tr><td colSpan="5"><div className="admin-empty">No registrations match these filters.</div></td></tr>}
    </tbody></table></div></section>
  </div></AdminLayout>;
}

export default AdminRegistrations;
