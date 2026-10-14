import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminPageHeader } from "../components/AdminUi";
import { useAdmin } from "../context/AdminContext";
import "./AdminStudents.css";

function AdminStudents() {
  const { students, isLoading, error } = useAdmin();
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => students.filter((student) => `${student.name} ${student.email}`.toLowerCase().includes(search.trim().toLowerCase())), [students, search]);
  return <AdminLayout><div className="admin-page">
    <AdminPageHeader eyebrow="STUDENT DIRECTORY" title="Students" description="Student accounts registered in the system." />
    {error && <p role="alert">{error}</p>}
    <div className="admin-toolbar"><label className="admin-search"><Search size={15} /><input type="search" aria-label="Search students" placeholder="Search name or email" value={search} onChange={(event) => setSearch(event.target.value)} /></label></div>
    <section className="admin-card admin-section"><div className="admin-section-heading"><div><h2>Student accounts</h2><p>{filtered.length} loaded students</p></div></div><div className="admin-table-wrap"><table className="admin-table admin-students-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Account created</th></tr></thead><tbody>{filtered.map((student) => <tr key={student.id}><td><strong>{student.name}</strong></td><td>{student.email}</td><td>Student</td><td>{student.registeredDate ? new Date(student.registeredDate).toLocaleDateString() : "—"}</td></tr>)}{!filtered.length && <tr><td colSpan="4"><div className="admin-empty">{isLoading ? "Loading student accounts..." : "No student accounts found."}</div></td></tr>}</tbody></table></div></section>
  </div></AdminLayout>;
}

export default AdminStudents;
