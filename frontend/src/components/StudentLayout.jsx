import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Bookmark,
  User,
  Bell,
  LogOut,
  Search,
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
            <LayoutDashboard size={23} />
          </div>

          <div>
            <h2>UniEvents</h2>
            <p>University Event Management</p>
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
          <div className="search-container">
            <Search size={20} />
            <input type="text" placeholder="Search events..." />
          </div>

          <div className="topbar-right">
            <button className="notification-button" type="button">
              <Bell size={21} />
              <span className="notification-badge">3</span>
            </button>

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