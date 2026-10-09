import { X } from "lucide-react";

const statusClass = (status) => String(status || "").toLowerCase().replaceAll(" ", "-");

export function AdminStatus({ status }) {
  return <span className={`admin-status ${statusClass(status)}`}>{status}</span>;
}

export function AdminModal({ title, onClose, children, size = "medium" }) {
  return <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className={`admin-modal ${size}`} role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
      <div className="admin-modal-header"><h2 id="admin-modal-title">{title}</h2><button type="button" className="admin-icon-button" aria-label="Close dialog" onClick={onClose}><X size={18} /></button></div>
      {children}
    </section>
  </div>;
}

export function AdminConfirmDialog({ title, message, onCancel, onConfirm, confirmLabel = "Delete", danger = true }) {
  return <AdminModal title={title} onClose={onCancel} size="small">
    <p className="admin-modal-message">{message}</p>
    <div className="admin-modal-actions"><button className="admin-button secondary" type="button" onClick={onCancel}>Cancel</button><button className={`admin-button${danger ? " danger" : ""}`} type="button" onClick={onConfirm}>{confirmLabel}</button></div>
  </AdminModal>;
}

export function AdminPageHeader({ eyebrow, title, description, action }) {
  return <header className="admin-page-header"><div>{eyebrow && <span className="admin-eyebrow">{eyebrow}</span>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="admin-page-header-action">{action}</div>}</header>;
}
