import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";

type UserRole = "student" | "organizer" | "admin";

function StudentDashboard() {
  return (
    <div className="dashboard-shell">
      <h1>Student Dashboard</h1>
      <p>Welcome to the student portal.</p>
    </div>
  );
}

function OrganizerDashboard() {
  return (
    <div className="dashboard-shell">
      <h1>Organizer Dashboard</h1>
      <p>Welcome to the organizer portal.</p>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="dashboard-shell">
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin portal.</p>
    </div>
  );
}

function App() {
  const [loggedInUser, setLoggedInUser] = useState<UserRole | null>(null);

  const handleLoginSuccess = (role: UserRole) => {
    setLoggedInUser(role);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            loggedInUser === "student" ? (
              <StudentDashboard />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route
          path="/organizer"
          element={
            loggedInUser === "organizer" ? (
              <OrganizerDashboard />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/admin"
          element={
            loggedInUser === "admin" ? <AdminDashboard /> : <Login onLoginSuccess={handleLoginSuccess} />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;