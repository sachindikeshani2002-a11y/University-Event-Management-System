import { useState } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { StudentProvider } from "./context/StudentContext";
import StudentDashboard from "./pages/StudentDashboard";
import Events from "./pages/Events";
import MyRegistrations from "./pages/MyRegistrations";
import SavedEvents from "./pages/SavedEvents";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Calendar from "./pages/Calendar";
import Login from "./pages/Login";

function MockPortal({ role }) {
  return (
    <main className="mock-portal">
      <h1>{role} Portal</h1>
      <p>Mock login succeeded. This portal is a frontend-only placeholder.</p>
    </main>
  );
}

function App() {
  const [loggedInRole, setLoggedInRole] = useState(null);

  return (
    <StudentProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              loggedInRole === "student" ? (
                <StudentDashboard />
              ) : (
                <Login onLoginSuccess={setLoggedInRole} />
              )
            }
          />
          <Route path="/login" element={<Login onLoginSuccess={setLoggedInRole} />} />
          <Route
            path="/organizer"
            element={
              loggedInRole === "organizer" ? (
                <MockPortal role="Organizer" />
              ) : (
                <Login onLoginSuccess={setLoggedInRole} />
              )
            }
          />
          <Route
            path="/admin"
            element={
              loggedInRole === "admin" ? (
                <MockPortal role="Admin" />
              ) : (
                <Login onLoginSuccess={setLoggedInRole} />
              )
            }
          />
          <Route path="/events" element={<Events />} />
          <Route path="/registrations" element={<MyRegistrations />} />
          <Route path="/saved-events" element={<SavedEvents />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StudentProvider>
  );
}

export default App;