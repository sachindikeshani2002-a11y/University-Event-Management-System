import { useMemo, useState } from "react";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminConfirmDialog, AdminModal, AdminPageHeader, AdminStatus } from "../components/AdminUi";
import { useAdmin } from "../context/AdminContext";
import "./AdminUsers.css";

function formatDate(value) { return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }

function AdminUsers() {
  const { users, updateUser, deleteUser } = useAdmin();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All roles");
  const [status, setStatus] = useState("All statuses");
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const filtered = useMemo(() => users.filter((user) => {
    const query = search.trim().toLowerCase();
    return (!query || `${user.name} ${user.email}`.toLowerCase().includes(query)) && (role === "All roles" || user.role === role) && (status === "All statuses" || user.status === status);
  }), [users, search, role, status]);
  const saveEdit = (event) => { event.preventDefault(); updateUser(editing.id, editing); setEditing(null); };

  return <AdminLayout><div className="admin-page">
    <AdminPageHeader eyebrow="ACCOUNT DIRECTORY" title="Users" description="Manage accounts and access status across the university." />
    <div className="admin-toolbar"><label className="admin-search"><Search size={15} /><input type="search" aria-label="Search users" placeholder="Search name or email" value={search} onChange={(event) => setSearch(event.target.value)} /></label><select className="admin-select" aria-label="Filter users by role" value={role} onChange={(event) => setRole(event.target.value)}><option>All roles</option><option>Student</option><option>Organizer</option><option>Administrator</option></select><select className="admin-select" aria-label="Filter users by status" value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Active</option><option>Inactive</option><option>Suspended</option></select></div>
    <section className="admin-card admin-section"><div className="admin-section-heading"><div><h2>All users</h2><p>{filtered.length} of {users.length} accounts</p></div></div><div className="admin-table-wrap"><table className="admin-table admin-users-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Registered</th><th>Actions</th></tr></thead><tbody>
      {filtered.map((user) => <tr key={user.id}><td><strong>{user.name}</strong><span className="admin-table-subtext">ID {user.id}</span></td><td>{user.email}</td><td>{user.role}</td><td><AdminStatus status={user.status} /></td><td>{formatDate(user.registeredDate)}</td><td><span className="admin-row-actions"><button className="admin-icon-button" type="button" title="View" aria-label={`View ${user.name}`} onClick={() => setViewing(user)}><Eye size={15} /></button><button className="admin-icon-button" type="button" title="Edit" aria-label={`Edit ${user.name}`} onClick={() => setEditing({ ...user })}><Pencil size={14} /></button><button className="admin-icon-button danger" type="button" title="Delete" aria-label={`Delete ${user.name}`} onClick={() => setDeleting(user)}><Trash2 size={14} /></button></span></td></tr>)}
      {!filtered.length && <tr><td colSpan="6"><div className="admin-empty">No users match these filters.</div></td></tr>}
    </tbody></table></div></section>
  </div>
  {viewing && <AdminModal title="User details" onClose={() => setViewing(null)}><div className="admin-detail-grid">{[["Name", viewing.name], ["Email", viewing.email], ["Role", viewing.role], ["Status", viewing.status], ["Registered", formatDate(viewing.registeredDate)]].map(([label, value]) => <div className="admin-detail-item" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></AdminModal>}
  {editing && <AdminModal title="Edit user" onClose={() => setEditing(null)}><form onSubmit={saveEdit}><div className="admin-form-grid"><div className="admin-form-field"><label htmlFor="user-name">Name</label><input className="admin-input" id="user-name" value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} required /></div><div className="admin-form-field"><label htmlFor="user-email">Email</label><input className="admin-input" id="user-email" type="email" value={editing.email} onChange={(event) => setEditing({ ...editing, email: event.target.value })} required /></div><div className="admin-form-field"><label htmlFor="user-role">Role</label><select className="admin-input" id="user-role" value={editing.role} onChange={(event) => setEditing({ ...editing, role: event.target.value })}><option>Student</option><option>Organizer</option><option>Administrator</option></select></div><div className="admin-form-field"><label htmlFor="user-status">Status</label><select className="admin-input" id="user-status" value={editing.status} onChange={(event) => setEditing({ ...editing, status: event.target.value })}><option>Active</option><option>Inactive</option><option>Suspended</option></select></div></div><div className="admin-modal-actions"><button type="button" className="admin-button secondary" onClick={() => setEditing(null)}>Cancel</button><button className="admin-button" type="submit">Save Changes</button></div></form></AdminModal>}
  {deleting && <AdminConfirmDialog title="Delete user?" message={`Are you sure you want to delete ${deleting.name}'s account?`} onCancel={() => setDeleting(null)} onConfirm={() => { deleteUser(deleting.id); setDeleting(null); }} />}
  </AdminLayout>;
}

export default AdminUsers;
