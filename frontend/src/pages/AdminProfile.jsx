import { useState } from "react";
import { Pencil, Save, X, UserRound, Mail, Building2, ShieldCheck } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminPageHeader } from "../components/AdminUi";
import "./AdminProfile.css";

const originalProfile = { name: "Admin User", email: "admin@university.edu", department: "Information Systems Office", adminId: "ADM-2024-001" };

function AdminProfile() {
  const [profile, setProfile] = useState(originalProfile);
  const [draft, setDraft] = useState(originalProfile);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const fields = [
    { name: "name", label: "Admin name", icon: UserRound, type: "text" },
    { name: "email", label: "Email address", icon: Mail, type: "email" },
    { name: "department", label: "Department", icon: Building2, type: "text" },
    { name: "adminId", label: "Admin ID", icon: ShieldCheck, type: "text", readonly: true },
  ];
  const save = (event) => { event.preventDefault(); setProfile(draft); setEditing(false); setNotice("Profile changes saved for this session."); };
  const cancel = () => { setDraft(profile); setEditing(false); };

  return <AdminLayout><div className="admin-page">
    <AdminPageHeader eyebrow="ADMINISTRATION" title="Admin Profile" description="Manage administrator contact information." action={!editing && <button className="admin-button secondary" type="button" onClick={() => { setDraft(profile); setEditing(true); }}><Pencil size={13} />Edit Profile</button>} />
    {notice && <div className="admin-feedback" role="status">{notice}</div>}
    <section className="admin-card admin-profile-card"><div className="admin-profile-banner"><span className="admin-profile-avatar">AD</span><div><strong>{profile.name}</strong><span>System Administrator</span></div></div><form className="admin-profile-form" onSubmit={save}>
      {fields.map(({ name, label, icon: Icon, type, readonly }) => <div className="admin-profile-field" key={name}><label htmlFor={`admin-profile-${name}`}>{label}</label><div className="admin-profile-value"><Icon size={15} aria-hidden="true" />{editing && !readonly ? <input id={`admin-profile-${name}`} type={type} value={draft[name]} required onChange={(event) => setDraft({ ...draft, [name]: event.target.value })} /> : <span>{profile[name]}</span>}</div></div>)}
      <div className="admin-profile-field"><label>Role</label><div className="admin-profile-value"><ShieldCheck size={15} /><span>Administrator</span></div></div>
      {editing && <div className="admin-form-actions"><button type="button" className="admin-button secondary" onClick={cancel}><X size={13} />Cancel</button><button type="submit" className="admin-button"><Save size={13} />Save Profile</button></div>}
    </form></section>
  </div></AdminLayout>;
}

export default AdminProfile;
