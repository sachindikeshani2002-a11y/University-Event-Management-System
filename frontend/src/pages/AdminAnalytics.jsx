import { UsersRound, CalendarDays, ClipboardList, TrendingUp, Trophy, UserRoundCheck } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminPageHeader } from "../components/AdminUi";
import { useAdmin } from "../context/AdminContext";
import "./AdminAnalytics.css";

function AdminAnalytics() {
  const { users, events, registrations, organizers } = useAdmin();
  const totalRegistrations = registrations.length;
  const average = events.length ? Math.round(totalRegistrations / events.length) : 0;
  const popularEvent = events.reduce((top, event) => !top || event.registrations > top.registrations ? event : top, null);
  const activeOrganizer = organizers.reduce((top, organizer) => {
    const count = events.filter((event) => event.organizerId === organizer.id).length;
    return !top || count > top.count ? { ...organizer, count } : top;
  }, null);
  const stats = [
    { label: "Total Users", value: users.length, icon: UsersRound },
    { label: "Total Events", value: events.length, icon: CalendarDays },
    { label: "Total Registrations", value: totalRegistrations, icon: ClipboardList },
    { label: "Average per Event", value: average, icon: TrendingUp },
    { label: "Most Popular Event", value: popularEvent?.title || "—", icon: Trophy, compact: true },
    { label: "Most Active Organizer", value: activeOrganizer?.name || "—", icon: UserRoundCheck, compact: true },
  ];
  const maxRegistrations = Math.max(...events.map((event) => event.registrations), 1);
  const byCategory = events.reduce((map, event) => ({ ...map, [event.category]: (map[event.category] || 0) + 1 }), {});
  const roles = ["Student", "Organizer", "Administrator"].map((role) => ({ role, count: users.filter((user) => user.role === role).length }));
  const statuses = ["Registered", "Cancelled", "Attended"].map((status) => ({ status, count: registrations.filter((item) => item.status === status).length }));

  return <AdminLayout><div className="admin-page">
    <AdminPageHeader eyebrow="SYSTEM INSIGHTS" title="Analytics" description="A university-wide view of event activity and participation." />
    <section className="admin-stat-grid admin-analytics-stats">{stats.map(({ label, value, icon: Icon, compact }) => <article className="admin-card admin-stat-card" key={label}><span className="admin-stat-icon"><Icon size={17} /></span><div className="admin-stat-copy"><span>{label}</span><strong className={compact ? "compact" : ""}>{value}</strong></div></article>)}</section>
    <div className="admin-analytics-grid">
      <section className="admin-card admin-section"><div className="admin-section-heading"><div><h2>Registrations by event</h2><p>Registration volume across events</p></div></div><div className="admin-chart-list">{events.map((event) => <div className="admin-chart-row" key={event.id}><div className="admin-chart-label"><span>{event.title}</span><strong>{event.registrations}</strong></div><div className="admin-chart-track"><span style={{ width: `${event.registrations / maxRegistrations * 100}%` }} /></div></div>)}</div></section>
      <section className="admin-card admin-section"><div className="admin-section-heading"><div><h2>Events by category</h2><p>Portfolio mix</p></div></div><div className="admin-chart-list">{Object.entries(byCategory).map(([category, count]) => <div className="admin-category-chart-row" key={category}><span>{category}</span><div className="admin-chart-track"><span style={{ width: `${count / Math.max(events.length, 1) * 100}%` }} /></div><strong>{count}</strong></div>)}</div></section>
      <section className="admin-card admin-section"><div className="admin-section-heading"><div><h2>Users by role</h2><p>Account distribution</p></div></div><div className="admin-chart-list">{roles.map(({ role, count }) => <div className="admin-category-chart-row" key={role}><span>{role}</span><div className="admin-chart-track"><span style={{ width: `${count / Math.max(users.length, 1) * 100}%` }} /></div><strong>{count}</strong></div>)}</div></section>
      <section className="admin-card admin-section"><div className="admin-section-heading"><div><h2>Registration status</h2><p>Attendee status distribution</p></div></div><div className="admin-chart-list">{statuses.map(({ status, count }) => <div className="admin-category-chart-row" key={status}><span>{status}</span><div className="admin-chart-track"><span className={`status-${status.toLowerCase()}`} style={{ width: `${count / Math.max(totalRegistrations, 1) * 100}%` }} /></div><strong>{count}</strong></div>)}</div></section>
    </div>
  </div></AdminLayout>;
}

export default AdminAnalytics;
