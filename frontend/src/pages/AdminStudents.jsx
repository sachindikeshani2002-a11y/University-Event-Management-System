import { useMemo, useState } from "react";
import { Eye, Pencil, Search, UserRoundCheck, UserRoundX } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminModal, AdminPageHeader, AdminStatus } from "../components/AdminUi";
import { useAdmin } from "../context/AdminContext";
import "./AdminStudents.css";

function AdminStudents() {
  const { students, updateStudent } = useAdmin();
  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState("All faculties");
  const [year, setYear] = useState("All years");
  const [status, setStatus] = useState("All statuses");
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const faculties = [...new Set(students.map((student) => student.faculty))].sort();
  const filtered = useMemo(() => students.filter((student) => {
    const query = search.trim().toLowerCase();
    return (!query || `${student.name} ${student.studentId} ${student.email}`.toLowerCase().includes(query)) && (faculty === "All faculties" || student.faculty === faculty) && (year === "All years" || student.year === year) && (status === "All statuses" || student.status === status);
  }), [students, search, faculty, year, status]);
  const saveStudent = (event) => { event.preventDefault(); updateStudent(editing.id, editing); setEditing(null); };
  const toggleStatus = (student) => updateStudent(student.id, { status: student.status === "Suspended" ? "Active" : "Suspended" });

  return <AdminLayout><div className="admin-page">
    <AdminPageHeader eyebrow="STUDENT DIRECTORY" title="Students" description="Review student profiles, participation, and account status." />
    <div className="admin-toolbar"><label className="admin-search"><Search size={15} /><input type="search" aria-label="Search students" placeholder="Search name, ID, or email" value={search} onChange={(event) => setSearch(event.target.value)} /></label><select className="admin-select" aria-label="Filter students by faculty" value={faculty} onChange={(event) => setFaculty(event.target.value)}><option>All faculties</option>{faculties.map((item) => <option key={item}>{item}</option>)}</select><select className="admin-select" aria-label="Filter students by year" value={year} onChange={(event) => setYear(event.target.value)}><option>All years</option>{["1", "2", "3", "4"].map((item) => <option key={item} value={item}>Year {item}</option>)}</select><select className="admin-select" aria-label="Filter students by status" value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Active</option><option>Inactive</option><option>Suspended</option></select></div>
    <section className="admin-card admin-section"><div className="admin-section-heading"><div><h2>Student accounts</h2><p>{filtered.length} students</p></div></div><div className="admin-table-wrap"><table className="admin-table admin-students-table"><thead><tr><th>Student</th><th>Faculty</th><th>Year</th><th>Events</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      {filtered.map((student) => <tr key={student.id}><td><strong>{student.name}</strong><span className="admin-table-subtext">{student.studentId} · {student.email}</span></td><td>{student.faculty}</td><td>Year {student.year}</td><td>{student.registeredEvents}</td><td><AdminStatus status={student.status} /></td><td><span className="admin-row-actions"><button className="admin-icon-button" type="button" aria-label={`View ${student.name}`} title="View" onClick={() => setViewing(student)}><Eye size={15} /></button><button className="admin-icon-button" type="button" aria-label={`Edit ${student.name}`} title="Edit" onClick={() => setEditing({ ...student })}><Pencil size={14} /></button><button className="admin-icon-actions" type="button" onClick={() => toggleStatus(student)} aria-label={`${student.status === "Suspended" ? "Activate" : "Suspend"} ${student.name}`} title={student.status === "Suspended" ? "Activate" : "Suspend"}>{student.status === "Suspended" ? <UserRoundCheck size={15} /> : <UserRoundX size={15} />}{student.status === "Suspended" ? "Activate" : "Suspend"}</button></span></td></tr>)}
      {!filtered.length && <tr><td colSpan="6"><div className="admin-empty">No students match these filters.</div></td></tr>}
    </tbody></table></div></section>
  </div>
  {viewing && <AdminModal title="Student profile" onClose={() => setViewing(null)}><div className="admin-detail-grid">{[["Name", viewing.name], ["Student ID", viewing.studentId], ["Email", viewing.email], ["Faculty", viewing.faculty], ["Year", `Year ${viewing.year}`], ["Registered events", viewing.registeredEvents], ["Status", viewing.status]].map(([label, value]) => <div className="admin-detail-item" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></AdminModal>}
  {editing && <AdminModal title="Edit student" onClose={() => setEditing(null)}><form onSubmit={saveStudent}><div className="admin-form-grid"><div className="admin-form-field"><label htmlFor="student-name">Name</label><input id="student-name" className="admin-input" value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} required /></div><div className="admin-form-field"><label htmlFor="student-email">Email</label><input id="student-email" type="email" className="admin-input" value={editing.email} onChange={(event) => setEditing({ ...editing, email: event.target.value })} required /></div><div className="admin-form-field"><label htmlFor="student-faculty">Faculty</label><input id="student-faculty" className="admin-input" value={editing.faculty} onChange={(event) => setEditing({ ...editing, faculty: event.target.value })} required /></div><div className="admin-form-field"><label htmlFor="student-year">Year</label><select id="student-year" className="admin-input" value={editing.year} onChange={(event) => setEditing({ ...editing, year: event.target.value })}>{["1", "2", "3", "4"].map((item) => <option key={item} value={item}>Year {item}</option>)}</select></div></div><div className="admin-modal-actions"><button type="button" className="admin-button secondary" onClick={() => setEditing(null)}>Cancel</button><button className="admin-button" type="submit">Save Changes</button></div></form></AdminModal>}
  </AdminLayout>;
}

export default AdminStudents;
