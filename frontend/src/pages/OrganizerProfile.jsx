import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Mail, Pencil, Save, UserRound, X } from "lucide-react";
import OrganizerLayout from "../components/OrganizerLayout";
import "./OrganizerProfile.css";

function OrganizerProfile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const initials = (user?.name || "Organizer").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setNotice(""); setError("");
    try { const result = await updateProfile({ name: name.trim(), email: email.trim() }); setName(result.name); setEmail(result.email); setEditing(false); setNotice("Profile updated."); }
    catch (failure) { setError(failure.message || "Unable to update your profile."); }
    finally { setSaving(false); }
  };
  return <OrganizerLayout><div className="organizer-page">
    <header className="organizer-page-header"><div><span className="organizer-eyebrow">ACCOUNT</span><h1>Organizer Profile</h1><p>Manage your account contact information.</p></div>{!editing && <button type="button" className="organizer-button secondary" onClick={() => setEditing(true)}><Pencil size={15} />Edit Profile</button>}</header>
    {notice && <div className="organizer-feedback" role="status">{notice}</div>}{error && <div className="organizer-feedback" role="alert">{error}</div>}
    <section className="organizer-card organizer-profile-card"><div className="organizer-profile-banner"><span className="organizer-profile-avatar">{initials}</span><div><strong>{user?.name}</strong><span>University Event Organizer</span></div></div>
      <form className="organizer-profile-form" onSubmit={save}>
        <div className="organizer-profile-field"><label htmlFor="organizer-name">Name</label><div className="organizer-profile-value"><UserRound size={16} />{editing ? <input id="organizer-name" required maxLength={120} value={name} onChange={(event) => setName(event.target.value)} /> : <span>{user?.name}</span>}</div></div>
        <div className="organizer-profile-field"><label htmlFor="organizer-email">Email address</label><div className="organizer-profile-value"><Mail size={16} />{editing ? <input id="organizer-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /> : <span>{user?.email}</span>}</div></div>
        {editing && <div className="organizer-form-actions"><button type="button" className="organizer-button secondary" onClick={() => { setName(user?.name || ""); setEmail(user?.email || ""); setEditing(false); }}><X size={15} />Cancel</button><button type="submit" className="organizer-button" disabled={saving}><Save size={15} />{saving ? "Saving..." : "Save Profile"}</button></div>}
      </form>
    </section>
  </div></OrganizerLayout>;
}

export default OrganizerProfile;
