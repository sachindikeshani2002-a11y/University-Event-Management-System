import { useMemo, useState } from "react";
import { Eye, Pencil, Search, UserRoundCheck, UserRoundX } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminModal, AdminPageHeader, AdminStatus } from "../components/AdminUi";
import { useAdmin } from "../context/AdminContext";
import "./AdminOrganizers.css";

function AdminOrganizers() {
  const { organizers, events, updateOrganizer } = useAdmin();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const filtered = useMemo(() => organizers.filter((organizer) => {
    const query = search.trim().toLowerCase();
    return (!query || `${organizer.name} ${organizer.email} ${organizer.department}`.toLowerCase().includes(query)) && (status === "All statuses" || organizer.status === status);
  }), [organizers, search, status]);
  const saveOrganizer = (event) => { event.preventDefault(); updateOrganizer(editing.id, editing); setEditing(null); };
  const toggleStatus = (organizer) => updateOrganizer(organizer.id, { status: organizer.status === "Suspended" ? "Active" : "Suspended" });

  return <AdminLayout><div className="admin-page">
    <AdminPageHeader eyebrow="ORGANIZER DIRECTORY" title="Organizers" description="Manage event organizers and their account access." />
    <div className="admin-toolbar"><label className="admin-search"><Search size={15} /><input type="search" aria-label="Search organizers" placeholder="Search organizer or department" value={search} onChange={(event) => setSearch(event.target.value)} /></label><select className="admin-select" aria-label="Filter organizers by status" value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Active</option><option>Suspended</option></select></div>
    <section className="admin-card admin-section"><div className="admin-section-heading"><div><h2>Organizer accounts</h2><p>{filtered.length} organizers</p></div></div><div className="admin-table-wrap"><table className="admin-table admin-organizers-table"><thead><tr><th>Organizer</th><th>Department</th><th>Events created</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      {filtered.map((organizer) => { const eventCount = events.filter((event) => event.organizerId === organizer.id).length; return <tr key={organizer.id}><td><strong>{organizer.name}</strong><span className="admin-table-subtext">{organizer.email}</span></td><td>{organizer.department}</td><td>{eventCount}</td><td><AdminStatus status={organizer.status} /></td><td><span className="admin-row-actions"><button className="admin-icon-button" type="button" aria-label={`View ${organizer.name}`} title="View" onClick={() => setViewing({ ...organizer, eventCount })}><Eye size={15} /></button><button className="admin-icon-button" type="button" aria-label={`Edit ${organizer.name}`} title="Edit" onClick={() => setEditing({ ...organizer })}><Pencil size={14} /></button><button className="admin-icon-actions" type="button" aria-label={`${organizer.status === "Suspended" ? "Activate" : "Suspend"} ${organizer.name}`} title={organizer.status === "Suspended" ? "Activate" : "Suspend"} onClick={() => toggleStatus(organizer)}>{organizer.status === "Suspended" ? <UserRoundCheck size={15} /> : <UserRoundX size={15} />}{organizer.status === "Suspended" ? "Activate" : "Suspend"}</button></span></td></tr>; })}
      {!filtered.length && <tr><td colSpan="5"><div className="admin-empty">No organizers match these filters.</div></td></tr>}
    </tbody></table></div></section>
  </div>
  {viewing && <AdminModal title="Organizer profile" onClose={() => setViewing(null)}><div className="admin-detail-grid">{[["Name", viewing.name], ["Email", viewing.email], ["Department", viewing.department], ["Events created", viewing.eventCount], ["Status", viewing.status]].map(([label, value]) => <div className="admin-detail-item" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></AdminModal>}
  {editing && <AdminModal title="Edit organizer" onClose={() => setEditing(null)}><form onSubmit={saveOrganizer}><div className="admin-form-grid"><div className="admin-form-field"><label htmlFor="organizer-name">Name</label><input id="organizer-name" className="admin-input" value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} required /></div><div className="admin-form-field"><label htmlFor="organizer-email">Email</label><input id="organizer-email" type="email" className="admin-input" value={editing.email} onChange={(event) => setEditing({ ...editing, email: event.target.value })} required /></div><div className="admin-form-field full"><label htmlFor="organizer-department">Department</label><input id="organizer-department" className="admin-input" value={editing.department} onChange={(event) => setEditing({ ...editing, department: event.target.value })} required /></div></div><div className="admin-modal-actions"><button type="button" className="admin-button secondary" onClick={() => setEditing(null)}>Cancel</button><button className="admin-button" type="submit">Save Changes</button></div></form></AdminModal>}
  </AdminLayout>;
}

export default AdminOrganizers;
