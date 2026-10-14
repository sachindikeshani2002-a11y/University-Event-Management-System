import { useMemo, useState } from "react";
import { Eye, Pencil, Search } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminModal, AdminPageHeader } from "../components/AdminUi";
import { useAdmin } from "../context/AdminContext";
import "./AdminUsers.css";

function formatDate(value) { return value ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"; }

function AdminUsers() {
  const { users, updateUser, isLoading, error, loadUserPage, userPage, userTotal } = useAdmin();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All roles");
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => users.filter((user) => {
    const query = search.trim().toLowerCase();
    return (!query || `${user.name} ${user.email}`.toLowerCase().includes(query)) && (role === "All roles" || user.role === role);
  }), [users, search, role]);

  const saveEdit = async (event) => {
    event.preventDefault();
    setNotice("");
    try {
      await updateUser(editing.id, editing);
      setNotice("Account changes saved.");
      setEditing(null);
    } catch (failure) {
      setNotice(failure.message || "Unable to update this account.");
    }
  };

  return <AdminLayout><div className="admin-page">
    <AdminPageHeader eyebrow="ACCOUNT DIRECTORY" title="Users" description="View accounts and assign trusted account roles." />
    {notice && <div className="admin-feedback" role="status">{notice}</div>}
    {error && <p role="alert">{error}</p>}
    <div className="admin-toolbar"><label className="admin-search"><Search size={15} /><input type="search" aria-label="Search users" placeholder="Search name or email" value={search} onChange={(event) => setSearch(event.target.value)} /></label><select className="admin-select" aria-label="Filter users by role" value={role} onChange={(event) => setRole(event.target.value)}><option>All roles</option><option>Student</option><option>Organizer</option><option>Administrator</option></select></div>
    <section className="admin-card admin-section"><div className="admin-section-heading"><div><h2>Accounts</h2><p>{filtered.length} rows · {userTotal} total accounts{isLoading ? " · Updating..." : ""}</p></div></div><div className="admin-table-wrap"><table className="admin-table admin-users-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Created</th><th>Actions</th></tr></thead><tbody>
      {filtered.map((user) => <tr key={user.id}><td><strong>{user.name}</strong><span className="admin-table-subtext">ID {user.id}</span></td><td>{user.email}</td><td>{user.role}</td><td>{formatDate(user.registeredDate)}</td><td><span className="admin-row-actions"><button className="admin-icon-button" type="button" title="View" aria-label={`View ${user.name}`} onClick={() => setViewing(user)}><Eye size={15} /></button><button className="admin-icon-button" type="button" title="Change role" aria-label={`Change role for ${user.name}`} onClick={() => setEditing({ ...user })}><Pencil size={14} /></button></span></td></tr>)}
      {!filtered.length && <tr><td colSpan="5"><div className="admin-empty">{isLoading ? "Loading accounts..." : "No accounts match these filters."}</div></td></tr>}
    </tbody></table></div><div className="admin-modal-actions"><button className="admin-button secondary" type="button" disabled={userPage <= 1 || isLoading} onClick={() => loadUserPage(userPage - 1)}>Previous</button><span>Page {userPage} of {Math.max(1, Math.ceil(userTotal / 100))}</span><button className="admin-button secondary" type="button" disabled={userPage >= Math.ceil(userTotal / 100) || isLoading} onClick={() => loadUserPage(userPage + 1)}>Next</button></div></section>
  </div>
  {viewing && <AdminModal title="Account details" onClose={() => setViewing(null)}><div className="admin-detail-grid">{[["Name", viewing.name], ["Email", viewing.email], ["Role", viewing.role], ["Created", formatDate(viewing.registeredDate)]].map(([label, value]) => <div className="admin-detail-item" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></AdminModal>}
  {editing && <AdminModal title="Update account" onClose={() => setEditing(null)}><form onSubmit={saveEdit}><div className="admin-form-grid"><div className="admin-form-field"><label htmlFor="user-name">Name</label><input className="admin-input" id="user-name" value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} required /></div><div className="admin-form-field"><label htmlFor="user-email">Email</label><input className="admin-input" id="user-email" type="email" value={editing.email} onChange={(event) => setEditing({ ...editing, email: event.target.value })} required /></div><div className="admin-form-field"><label htmlFor="user-role">Role</label><select className="admin-input" id="user-role" value={editing.role} onChange={(event) => setEditing({ ...editing, role: event.target.value })}><option>Student</option><option>Organizer</option><option>Administrator</option></select></div></div><div className="admin-modal-actions"><button type="button" className="admin-button secondary" onClick={() => setEditing(null)}>Cancel</button><button type="submit" className="admin-button">Save Changes</button></div></form></AdminModal>}
  </AdminLayout>;
}

export default AdminUsers;
