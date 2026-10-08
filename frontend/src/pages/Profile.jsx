import StudentLayout from "../components/StudentLayout";
import "./Profile.css";

function Profile() {
  const student = {
    name: "Asha Perera",
    role: "Student",
    email: "placeholder@email.com",
    faculty: "Faculty of Computing",
    studentId: "2026/CS/145",
  };

  return (
    <StudentLayout>
      <div className="page-shell profile-page-shell">
        <div className="page-header">
          <div>
            <h1>Profile</h1>
            <p>Student account overview.</p>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-header">
            <div className="student-avatar-large">AP</div>
            <div>
              <h2>{student.name}</h2>
              <span>{student.role}</span>
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-row">
              <label>Name</label>
              <p>{student.name}</p>
            </div>

            <div className="profile-row">
              <label>Role</label>
              <p>{student.role}</p>
            </div>

            <div className="profile-row">
              <label>Email</label>
              <p>{student.email}</p>
            </div>

            <div className="profile-row">
              <label>Faculty</label>
              <p>{student.faculty}</p>
            </div>

            <div className="profile-row">
              <label>Student ID</label>
              <p>{student.studentId}</p>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

export default Profile;
