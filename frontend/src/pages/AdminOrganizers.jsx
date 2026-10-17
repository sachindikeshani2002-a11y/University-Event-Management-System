import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminPageHeader } from "../components/AdminUi";
import { useAdmin } from "../context/AdminContext";
import "./AdminOrganizers.css";

function AdminOrganizers() {
  const { organizers, events, isLoading, error } = useAdmin();
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => organizers.filter((item) => `${item.name} ${item.email}`.toLowerCase().includes(search.trim().toLowerCase())), [organizers, search]);
  return <AdminLayout><div className="admin-page">
    <AdminPageHeader eyebrow="ORGANIZER DIRECTORY" title="Organizers" description="Organizer accounts and their submitted events." />
    {error && <p role="alert">{error}</p>}
    <div className="admin-toolbar"><label className="admin-search"><Search size={15} /><input type="search" aria-label="Search organizers" placeholder="Search name or email" value={search} onChange={(event) => setSearch(event.target.value)} /></label></div>
    <section className="admin-card admin-section"><div className="admin-section-heading"><div><h2>Organizer accounts</h2><p>{filtered.length} loaded organizers</p></div></div><div className="admin-table-wrap"><table className="admin-table admin-organizers-table"><thead><tr><th>Name</th><th>Email</th><th>Events submitted</th></tr></thead><tbody>{filtered.map((organizer) => <tr key={organizer.id}><td><strong>{organizer.name}</strong></td><td>{organizer.email}</td><td>{events.filter((event) => String(event.organizerId) === String(organizer.id)).length}</td></tr>)}{!filtered.length && <tr><td colSpan="3"><div className="admin-empty">{isLoading ? "Loading organizer accounts..." : "No organizer accounts found."}</div></td></tr>}</tbody></table></div></section>
  </div></AdminLayout>;
}

export default AdminOrganizers;
