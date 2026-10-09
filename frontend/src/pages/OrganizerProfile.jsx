import { useState } from "react";
import { Pencil, Save, X, UserRound, Mail, Building2, BadgeCheck } from "lucide-react";
import OrganizerLayout from "../components/OrganizerLayout";
import "./OrganizerProfile.css";

const initialProfile = {
  name: "Alex Perera",
  email: "alex.perera@university.edu",
  department: "Office of Student Affairs",
  organizerId: "ORG-2026-014",
};

function OrganizerProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const fields = [
    { name: "name", label: "Organizer name", icon: UserRound, type: "text" },
    { name: "email", label: "Email address", icon: Mail, type: "email" },
    { name: "department", label: "Faculty / department", icon: Building2, type: "text" },
    { name: "organizerId", label: "Organizer ID", icon: BadgeCheck, type: "text", readOnly: true },
  ];

  const saveProfile = (event) => {
    event.preventDefault();
    setProfile(draft);
    setEditing(false);
    setNotice("Profile changes saved for this session.");
  };

  const cancelEdit = () => { setDraft(profile); setEditing(false); };

  return (
    <OrganizerLayout>
      <div className="organizer-page">
        <header className="organizer-page-header"><div><span className="organizer-eyebrow">ACCOUNT</span><h1>Organizer Profile</h1><p>Manage your organizer contact information.</p></div>{!editing && <button type="button" className="organizer-button secondary" onClick={() => { setDraft(profile); setEditing(true); }}><Pencil size={15} />Edit Profile</button>}</header>
        {notice && <div className="organizer-feedback" role="status">{notice}</div>}
        <section className="organizer-card organizer-profile-card">
          <div className="organizer-profile-banner"><span className="organizer-profile-avatar">AO</span><div><strong>{profile.name}</strong><span>University Event Organizer</span></div></div>
          <form className="organizer-profile-form" onSubmit={saveProfile}>
            {fields.map(({ name, label, icon: Icon, type, readOnly }) => <div className="organizer-profile-field" key={name}><label htmlFor={`profile-${name}`}>{label}</label><div className="organizer-profile-value"><Icon size={16} aria-hidden="true" />{editing && !readOnly ? <input id={`profile-${name}`} type={type} required value={draft[name]} onChange={(event) => setDraft((current) => ({ ...current, [name]: event.target.value }))} /> : <span>{profile[name]}</span>}</div></div>)}
            {editing && <div className="organizer-form-actions"><button type="button" className="organizer-button secondary" onClick={cancelEdit}><X size={15} />Cancel</button><button type="submit" className="organizer-button"><Save size={15} />Save Profile</button></div>}
          </form>
        </section>
      </div>
    </OrganizerLayout>
  );
}

export default OrganizerProfile;
