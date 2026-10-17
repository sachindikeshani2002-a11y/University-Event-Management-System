import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserDisplayName, getUserInitials, getUserRoleLabel } from "../utils/userIdentity";
import {
  LayoutDashboard,
  CalendarDays,
  GraduationCap,
  ClipboardList,
  Bookmark,
  User,
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import "../pages/StudentDashboard.css";

function StudentLayout({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const displayName = getUserDisplayName(user);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    setMobileNavOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? "active" : ""}`;
  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <div className="student-dashboard">
      <aside className={`dashboard-sidebar${mobileNavOpen ? " is-open" : ""}`}>
        <Link className="sidebar-brand" to="/" onClick={closeMobileNav}>
          <span className="brand-icon">
            <GraduationCap size={24} aria-hidden="true" />
          </span>
          <span className="brand-copy">
            <strong>University Event</strong>
            <span>Management System</span>
          </span>
        </Link>

        <nav className="sidebar-navigation" aria-label="Student navigation">
          <NavLink to="/" end className={navLinkClass} onClick={closeMobileNav}>
            <LayoutDashboard size={18} aria-hidden="true" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/events" className={navLinkClass} onClick={closeMobileNav}>
            <CalendarDays size={18} aria-hidden="true" />
            <span>Events</span>
          </NavLink>

          <NavLink to="/registrations" className={navLinkClass} onClick={closeMobileNav}>
            <ClipboardList size={18} aria-hidden="true" />
            <span>My Registrations</span>
          </NavLink>

          <NavLink to="/saved-events" className={navLinkClass} onClick={closeMobileNav}>
            <Bookmark size={18} aria-hidden="true" />
            <span>Saved Events</span>
          </NavLink>

          <NavLink to="/calendar" className={navLinkClass} onClick={closeMobileNav}>
            <CalendarDays size={18} aria-hidden="true" />
            <span>Calendar</span>
          </NavLink>

          <NavLink to="/profile" className={navLinkClass} onClick={closeMobileNav}>
            <User size={18} aria-hidden="true" />
            <span>Profile</span>
          </NavLink>

          <NavLink to="/notifications" className={navLinkClass} onClick={closeMobileNav}>
            <Bell size={18} aria-hidden="true" />
            <span>Notifications</span>
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <button type="button" className="sidebar-link logout-button" onClick={handleLogout}>
            <LogOut size={18} aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {mobileNavOpen && (
        <button
          className="student-nav-backdrop"
          type="button"
          aria-label="Close student navigation"
          onClick={closeMobileNav}
        />
      )}

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-right">
            <button
              type="button"
              className="student-menu-button"
              aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              {mobileNavOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
            <Link
              to="/notifications"
              className="notification-button"
              aria-label="View notifications"
              title="View notifications"
              onClick={closeMobileNav}
            >
              <Bell size={21} aria-hidden="true" />
            </Link>

            <Link
              to="/profile"
              className="student-profile"
              aria-label={`View profile for ${displayName}, ${getUserRoleLabel(user)}`}
              onClick={closeMobileNav}
            >
              <div className="student-avatar" aria-hidden="true">{getUserInitials(user)}</div>

              <div className="student-info">
                <strong>{displayName}</strong>
                <span>{getUserRoleLabel(user)}</span>
              </div>
            </Link>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

export default StudentLayout;
