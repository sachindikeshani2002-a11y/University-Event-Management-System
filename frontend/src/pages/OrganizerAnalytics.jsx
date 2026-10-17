import { Activity, CalendarDays, TrendingUp, Award } from "lucide-react";
import OrganizerLayout from "../components/OrganizerLayout";
import { useOrganizer } from "../context/OrganizerContext";
import "./OrganizerAnalytics.css";

function OrganizerAnalytics() {
  const { organizerEvents, registrations } = useOrganizer();
  const totalEvents = organizerEvents.length;
  const totalRegistrations = organizerEvents.reduce((sum, event) => sum + Number(event.registrationCount || 0), 0);
  const average = totalEvents ? Math.round(totalRegistrations / totalEvents) : 0;
  const mostPopular = organizerEvents.reduce((top, event) => !top || event.registrationCount > top.registrationCount ? event : top, null);
  const maxCount = Math.max(...organizerEvents.map((event) => event.registrationCount), 1);
  const categoryCounts = organizerEvents.reduce((counts, event) => {
    counts[event.category] = (counts[event.category] || 0) + 1;
    return counts;
  }, {});
  const statusCounts = ["Registered", "Cancelled", "Attended"].map((status) => ({
    status,
    count: registrations.filter((item) => item.status === status).length,
  }));
  const stats = [
    { label: "Total Events", value: totalEvents, icon: CalendarDays },
    { label: "Total Registrations", value: totalRegistrations.toLocaleString(), icon: Activity },
    { label: "Average per Event", value: average, icon: TrendingUp },
    { label: "Most Popular Event", value: mostPopular?.title || "—", icon: Award, compact: true },
  ];

  return (
    <OrganizerLayout>
      <div className="organizer-page">
        <header className="organizer-page-header"><div><span className="organizer-eyebrow">PERFORMANCE OVERVIEW</span><h1>Analytics</h1><p>Participation and event activity across your university events.</p></div></header>
        <section className="organizer-stat-grid organizer-analytics-stats">
          {stats.map(({ label, value, icon: Icon, compact }) => <article className="organizer-card organizer-stat-card" key={label}><span className="organizer-stat-icon"><Icon size={18} /></span><div className="organizer-stat-copy"><span>{label}</span><strong className={compact ? "compact" : ""}>{value}</strong></div></article>)}
        </section>
        <div className="organizer-analytics-grid">
          <section className="organizer-card organizer-section-card">
            <div className="organizer-section-heading"><div><h2>Registrations per event</h2><p>Current registrations compared by event</p></div></div>
            <div className="organizer-chart-bars">{organizerEvents.slice().sort((a, b) => b.registrationCount - a.registrationCount).map((event) => <div className="organizer-bar-row" key={event.id}><div className="organizer-bar-label"><span>{event.title}</span><strong>{event.registrationCount}</strong></div><div className="organizer-bar-track"><span style={{ width: `${(event.registrationCount / maxCount) * 100}%` }} /></div></div>)}</div>
          </section>
          <section className="organizer-card organizer-section-card">
            <div className="organizer-section-heading"><div><h2>Events by category</h2><p>Portfolio distribution</p></div></div>
            <div className="organizer-category-list">{Object.entries(categoryCounts).map(([category, count]) => <div className="organizer-category-row" key={category}><span>{category}</span><div className="organizer-category-track"><span style={{ width: `${(count / Math.max(totalEvents, 1)) * 100}%` }} /></div><strong>{count}</strong></div>)}</div>
          </section>
          <section className="organizer-card organizer-section-card organizer-status-chart">
            <div className="organizer-section-heading"><div><h2>Registration status</h2><p>Mock attendee status breakdown</p></div></div>
            <div className="organizer-status-bars">{statusCounts.map(({ status, count }) => <div className="organizer-status-row" key={status}><span className={`organizer-status ${status.toLowerCase()}`}>{status}</span><div className="organizer-category-track"><span style={{ width: `${(count / Math.max(registrations.length, 1)) * 100}%` }} /></div><strong>{count}</strong></div>)}</div>
          </section>
        </div>
      </div>
    </OrganizerLayout>
  );
}

export default OrganizerAnalytics;
