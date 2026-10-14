import { useState } from "react";
import { Mail, Pencil, Save, ShieldCheck, UserRound, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/AdminLayout";
import { AdminPageHeader } from "../components/AdminUi";
import "./AdminProfile.css";

function AdminProfile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setNotice(""); setError("");
    try { const result = await updateProfile({ name: name.trim(), email: email.trim() }); setName(result.name); setEmail(result.email); setEditing(false); setNotice("Profile updated."); }
    catch (failure) { setError(failure.message || "Unable to update your profile."); }
    finally { setSaving(false); }
  };
  return <AdminLayout><div className="admin-page">
    <AdminPageHeader eyebrow="ADMINISTRATION" title="Admin Profile" description="Manage your account contact information." action={!editing && <button className="admin-button secondary" type="button" onClick={() => setEditing(true)}><Pencil size={13} />Edit Profile</button>} />
    {notice && <div className="admin-feedback" role="status">{notice}</div>}{error && <p role="alert">{error}</p>}
    <section className="admin-card admin-profile-card"><div className="admin-profile-banner"><span className="admin-profile-avatar">{(user?.name || "Admin").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span><div><strong>{user?.name}</strong><span>System Administrator</span></div></div>
      <form className="admin-profile-form" onSubmit={save}>
        <div className="admin-profile-field"><label htmlFor="admin-name">Name</label><div className="admin-profile-value"><UserRound size={15} />{editing ? <input id="admin-name" required maxLength={120} value={name} onChange={(event) => setName(event.target.value)} /> : <span>{user?.name}</span>}</div></div>
        <div className="admin-profile-field"><label htmlFor="admin-email">Email address</label><div className="admin-profile-value"><Mail size={15} />{editing ? <input id="admin-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /> : <span>{user?.email}</span>}</div></div>
        <div className="admin-profile-field"><label>Role</label><div className="admin-profile-value"><ShieldCheck size={15} /><span>Administrator</span></div></div>
        {editing && <div className="admin-form-actions"><button type="button" className="admin-button secondary" onClick={() => { setName(user?.name || ""); setEmail(user?.email || ""); setEditing(false); }}><X size={13} />Cancel</button><button type="submit" className="admin-button" disabled={saving}><Save size={13} />{saving ? "Saving..." : "Save Profile"}</button></div>}
      </form>
    </section>
  </div></AdminLayout>;
}

export default AdminProfile;
