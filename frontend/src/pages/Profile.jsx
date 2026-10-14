import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import StudentLayout from "../components/StudentLayout";
import "./Profile.css";

function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const initials = (user?.name || "Student").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  const saveProfile = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");
    try {
      const updated = await updateProfile({ name: name.trim(), email: email.trim() });
      setName(updated.name);
      setEmail(updated.email);
      setMessage("Profile updated.");
    } catch (reason) {
      setError(reason.message || "Unable to update your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StudentLayout>
      <div className="page-shell profile-page-shell">
        <div className="page-header"><div><h1>Profile</h1><p>Your account information.</p></div></div>
        <div className="profile-card">
          <div className="profile-header"><div className="student-avatar-large">{initials}</div><div><h2>{user?.name}</h2><span>Student</span></div></div>
          {message && <p role="status">{message}</p>}
          {error && <p role="alert">{error}</p>}
          <form onSubmit={saveProfile}>
            <div className="profile-details">
              <div className="profile-row"><label htmlFor="profile-name">Name</label><input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={120} /></div>
              <div className="profile-row"><label htmlFor="profile-role">Role</label><p id="profile-role">Student</p></div>
              <div className="profile-row"><label htmlFor="profile-email">Email</label><input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
            </div>
            <button className="primary-action-button" type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save Profile"}</button>
          </form>
        </div>
      </div>
    </StudentLayout>
  );
}

export default Profile;
