import { useMemo, useState } from "react";
import { Search, Activity } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminPageHeader } from "../components/AdminUi";
import { useAdmin } from "../context/AdminContext";
import "./AdminActivityLogs.css";

function formatDate(value) { return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }

function AdminActivityLogs() {
  const { activityLogs } = useAdmin();
  const [userFilter, setUserFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [actionFilter, setActionFilter] = useState("All actions");
  const users = [...new Set(activityLogs.map((log) => log.user))].sort();
  const filtered = useMemo(() => activityLogs.filter((log) =>
    (!userFilter || log.user === userFilter) &&
    (roleFilter === "All roles" || log.role === roleFilter) &&
    (actionFilter === "All actions" || log.action.toLowerCase().includes(actionFilter.toLowerCase()))
  ), [activityLogs, userFilter, roleFilter, actionFilter]);

  return <AdminLayout><div className="admin-page">
    <AdminPageHeader eyebrow="AUDIT TRAIL" title="Activity Logs" description="A record of important actions across the event system." />
    <div className="admin-toolbar"><label className="admin-search"><Search size={15} /><select aria-label="Filter activity by user" value={userFilter} onChange={(event) => setUserFilter(event.target.value)}><option value="">All users</option>{users.map((user) => <option key={user}>{user}</option>)}</select></label><select className="admin-select" aria-label="Filter activity by role" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}><option>All roles</option><option>Administrator</option><option>Organizer</option><option>Student</option></select><select className="admin-select" aria-label="Filter activity by action" value={actionFilter} onChange={(event) => setActionFilter(event.target.value)}>{["All actions", "Created", "Updated", "Approved", "Rejected", "Deleted", "Registered"].map((action) => <option key={action}>{action}</option>)}</select></div>
    <section className="admin-card admin-section"><div className="admin-section-heading"><div><h2>System activity</h2><p>{filtered.length} activity records</p></div><span className="admin-activity-icon"><Activity size={16} /></span></div><div className="admin-table-wrap"><table className="admin-table admin-activity-table"><thead><tr><th>Action</th><th>User</th><th>Role</th><th>Date</th><th>Time</th></tr></thead><tbody>
      {filtered.map((log) => <tr key={log.id}><td><strong>{log.action}</strong></td><td>{log.user}</td><td>{log.role}</td><td>{formatDate(log.date)}</td><td>{log.time}</td></tr>)}
      {!filtered.length && <tr><td colSpan="5"><div className="admin-empty">No activity matches these filters.</div></td></tr>}
    </tbody></table></div></section>
  </div></AdminLayout>;
}

export default AdminActivityLogs;
