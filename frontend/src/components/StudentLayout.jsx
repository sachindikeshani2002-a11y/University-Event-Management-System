import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  GraduationCap,
  ClipboardList,
  Bookmark,
  User,
  Bell,
  LogOut,
} from "lucide-react";
import "../pages/StudentDashboard.css";

function StudentLayout({ children }) {
  const [logoutMessage, setLogoutMessage] = useState("");
  const location = useLocation();

  const navLinkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? "active" : ""}`;

  return (
    <div className="student-dashboard">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <GraduationCap size={25} aria-hidden="true" />
          </div>

          <div className="brand-copy">
            <h2>University Event</h2>
            <p>Management System</p>
          </div>
        </div>

        <nav className="sidebar-navigation">
          <NavLink to="/" className={navLinkClass}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink to="/events" className={navLinkClass}>
            <CalendarDays size={20} />
            Events
          </NavLink>

          <NavLink to="/registrations" className={navLinkClass}>
            <ClipboardList size={20} />
            My Registrations
          </NavLink>

          <NavLink to="/saved-events" className={navLinkClass}>
            <Bookmark size={20} />
            Saved Events
          </NavLink>

          <Link
            to="/calendar"
            className={`sidebar-link ${location.pathname === "/calendar" ? "active" : ""}`}
          >
            <CalendarDays size={20} />
            Calendar
          </Link>

          <NavLink to="/profile" className={navLinkClass}>
            <User size={20} />
            Profile
          </NavLink>

          <NavLink to="/notifications" className={navLinkClass}>
            <Bell size={20} />
            Notifications
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="sidebar-link logout-button"
            onClick={() =>
              setLogoutMessage(
                "Logout functionality will be connected when authentication is implemented."
              )
            }
          >
            <LogOut size={20} />
            Logout
          </button>
          {logoutMessage && <p className="logout-message">{logoutMessage}</p>}
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-right">
            <Link
              to="/notifications"
              className="notification-button"
              aria-label="View notifications"
              title="View notifications"
            >
              <Bell size={21} aria-hidden="true" />
              <span className="notification-badge" aria-hidden="true">3</span>
            </Link>

            <div className="student-profile">
              <div className="student-avatar">AP</div>

              <div className="student-info">
                <strong>Asha Perera</strong>
                <span>Student</span>
              </div>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

export default StudentLayout;