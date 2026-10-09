import { useState } from "react";
import { Plus, Pencil, Trash2, Megaphone, X } from "lucide-react";
import OrganizerLayout from "../components/OrganizerLayout";
import { useOrganizer } from "../context/OrganizerContext";
import "./OrganizerAnnouncements.css";

const emptyAnnouncement = { title: "", message: "", date: new Date().toISOString().slice(0, 10), status: "Draft" };

function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function OrganizerAnnouncements() {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useOrganizer();
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(emptyAnnouncement);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState("");
  const isEditing = Boolean(formData.id);

  const openCreate = () => { setFormData({ ...emptyAnnouncement }); setFormOpen(true); };
  const openEdit = (announcement) => { setFormData({ ...announcement }); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setFormData(emptyAnnouncement); };
  const updateField = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));

  const saveAnnouncement = (event) => {
    event.preventDefault();
    if (isEditing) {
      updateAnnouncement(formData.id, formData);
      setNotice("Announcement updated.");
    } else {
      addAnnouncement(formData);
      setNotice("Announcement created.");
    }
    closeForm();
  };

  const confirmDelete = () => {
    deleteAnnouncement(deleteTarget.id);
    setNotice("Announcement deleted.");
    setDeleteTarget(null);
  };

  return (
    <OrganizerLayout>
      <div className="organizer-page">
        <header className="organizer-page-header"><div><span className="organizer-eyebrow">CAMPUS COMMUNICATION</span><h1>Announcements</h1><p>Share timely updates with your university community.</p></div><button className="organizer-button" type="button" onClick={openCreate}><Plus size={16} />New Announcement</button></header>
        {notice && <div className="organizer-feedback" role="status">{notice}<button type="button" className="organizer-notice-dismiss" aria-label="Dismiss message" onClick={() => setNotice("")}>×</button></div>}
        <section className="organizer-announcement-list" aria-label="Announcements">
          {announcements.map((announcement) => <article className="organizer-card organizer-announcement-card" key={announcement.id}>
            <span className="organizer-announcement-icon"><Megaphone size={18} /></span>
            <div className="organizer-announcement-copy"><div className="organizer-announcement-meta"><span className={`organizer-status ${announcement.status.toLowerCase()}`}>{announcement.status}</span><time dateTime={announcement.date}>{formatDate(announcement.date)}</time></div><h2>{announcement.title}</h2><p>{announcement.message}</p></div>
            <div className="organizer-row-actions"><button className="organizer-icon-button" type="button" onClick={() => openEdit(announcement)} aria-label={`Edit ${announcement.title}`} title="Edit"><Pencil size={15} /></button><button className="organizer-icon-button danger" type="button" onClick={() => setDeleteTarget(announcement)} aria-label={`Delete ${announcement.title}`} title="Delete"><Trash2 size={15} /></button></div>
          </article>)}
          {!announcements.length && <div className="organizer-card organizer-empty-state">No announcements yet.</div>}
        </section>
      </div>

      {formOpen && <div className="organizer-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}><section className="organizer-modal organizer-announcement-modal" role="dialog" aria-modal="true" aria-labelledby="announcement-form-title">
        <div className="organizer-modal-title-row"><h2 id="announcement-form-title">{isEditing ? "Edit announcement" : "New announcement"}</h2><button className="organizer-icon-button" type="button" onClick={closeForm} aria-label="Close"><X size={17} /></button></div>
        <form onSubmit={saveAnnouncement} className="organizer-announcement-form">
          <div className="organizer-form-field"><label htmlFor="announcement-title">Title <span>*</span></label><input className="organizer-input" id="announcement-title" name="title" value={formData.title} onChange={updateField} required maxLength={120} /></div>
          <div className="organizer-form-field"><label htmlFor="announcement-message">Message <span>*</span></label><textarea className="organizer-textarea" id="announcement-message" name="message" value={formData.message} onChange={updateField} required maxLength={1000} /></div>
          <div className="organizer-announcement-form-row"><div className="organizer-form-field"><label htmlFor="announcement-date">Date</label><input className="organizer-input" id="announcement-date" name="date" type="date" value={formData.date} onChange={updateField} required /></div><div className="organizer-form-field"><label htmlFor="announcement-status">Status</label><select className="organizer-input" id="announcement-status" name="status" value={formData.status} onChange={updateField}><option>Draft</option><option>Published</option></select></div></div>
          <div className="organizer-modal-actions"><button className="organizer-button secondary" type="button" onClick={closeForm}>Cancel</button><button className="organizer-button" type="submit">{isEditing ? "Save Changes" : "Create Announcement"}</button></div>
        </form>
      </section></div>}

      {deleteTarget && <div className="organizer-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteTarget(null); }}><section className="organizer-modal" role="dialog" aria-modal="true" aria-labelledby="delete-announcement-title"><h2 id="delete-announcement-title">Delete announcement?</h2><p>Are you sure you want to delete “{deleteTarget.title}”?</p><div className="organizer-modal-actions"><button className="organizer-button secondary" type="button" onClick={() => setDeleteTarget(null)}>Cancel</button><button className="organizer-button danger" type="button" onClick={confirmDelete}>Delete</button></div></section></div>}
    </OrganizerLayout>
  );
}

export default OrganizerAnnouncements;
