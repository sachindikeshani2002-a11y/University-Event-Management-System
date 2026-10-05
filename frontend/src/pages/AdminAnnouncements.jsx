import { useState } from "react";
import { Plus, Pencil, Trash2, Megaphone } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminConfirmDialog, AdminModal, AdminPageHeader, AdminStatus } from "../components/AdminUi";
import { useAdmin } from "../context/AdminContext";
import "./AdminAnnouncements.css";

const emptyItem = () => ({ title: "", message: "", audience: "All Users", date: new Date().toISOString().slice(0, 10), status: "Draft" });
function formatDate(value) { return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }

function AdminAnnouncements() {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useAdmin();
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(emptyItem());
  const [deleting, setDeleting] = useState(null);
  const [notice, setNotice] = useState("");
  const editing = Boolean(formData.id);
  const openCreate = () => { setFormData(emptyItem()); setFormOpen(true); };
  const openEdit = (item) => { setFormData({ ...item }); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setFormData(emptyItem()); };
  const save = (event) => { event.preventDefault(); if (editing) { updateAnnouncement(formData.id, formData); setNotice("Announcement updated."); } else { addAnnouncement(formData); setNotice("Announcement created."); } closeForm(); };
  const confirmDelete = () => { deleteAnnouncement(deleting.id); setNotice("Announcement deleted."); setDeleting(null); };

  return <AdminLayout><div className="admin-page">
    <AdminPageHeader eyebrow="CAMPUS COMMUNICATION" title="Announcements" description="Create and publish system-wide updates for the university community." action={<button className="admin-button" type="button" onClick={openCreate}><Plus size={14} />New Announcement</button>} />
    {notice && <div className="admin-feedback" role="status">{notice}<button type="button" aria-label="Dismiss" onClick={() => setNotice("")}>×</button></div>}
    <section className="admin-announcement-list">{announcements.map((item) => <article className="admin-card admin-announcement-card" key={item.id}><span className="admin-announcement-icon"><Megaphone size={17} /></span><div className="admin-announcement-copy"><div><AdminStatus status={item.status} /><span className="admin-announcement-audience">{item.audience}</span><time>{formatDate(item.date)}</time></div><h2>{item.title}</h2><p>{item.message}</p></div><span className="admin-row-actions"><button className="admin-icon-button" type="button" aria-label={`Edit ${item.title}`} title="Edit" onClick={() => openEdit(item)}><Pencil size={14} /></button><button className="admin-icon-button danger" type="button" aria-label={`Delete ${item.title}`} title="Delete" onClick={() => setDeleting(item)}><Trash2 size={14} /></button></span></article>)}{!announcements.length && <div className="admin-card admin-empty">No announcements available.</div>}</section>
  </div>
  {formOpen && <AdminModal title={editing ? "Edit announcement" : "New announcement"} onClose={closeForm}><form onSubmit={save}><div className="admin-form-grid"><div className="admin-form-field full"><label htmlFor="announcement-title">Title <span>*</span></label><input id="announcement-title" className="admin-input" value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} required maxLength={120} /></div><div className="admin-form-field full"><label htmlFor="announcement-message">Message <span>*</span></label><textarea id="announcement-message" className="admin-textarea" value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} required maxLength={1000} /></div><div className="admin-form-field"><label htmlFor="announcement-audience">Audience</label><select id="announcement-audience" className="admin-input" value={formData.audience} onChange={(event) => setFormData({ ...formData, audience: event.target.value })}><option>All Users</option><option>Students</option><option>Organizers</option></select></div><div className="admin-form-field"><label htmlFor="announcement-date">Date</label><input id="announcement-date" className="admin-input" type="date" value={formData.date} onChange={(event) => setFormData({ ...formData, date: event.target.value })} required /></div><div className="admin-form-field"><label htmlFor="announcement-status">Status</label><select id="announcement-status" className="admin-input" value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value })}><option>Draft</option><option>Published</option></select></div></div><div className="admin-modal-actions"><button className="admin-button secondary" type="button" onClick={closeForm}>Cancel</button><button className="admin-button" type="submit">{editing ? "Save Changes" : "Create Announcement"}</button></div></form></AdminModal>}
  {deleting && <AdminConfirmDialog title="Delete announcement?" message={`Delete “${deleting.title}” from announcements?`} onCancel={() => setDeleting(null)} onConfirm={confirmDelete} />}
  </AdminLayout>;
}

export default AdminAnnouncements;
