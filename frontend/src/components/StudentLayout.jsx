import { Link, useLocation } from "react-router-dom";
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

function StudentLayout({ children }) {
  const location = useLocation();

  return (
    <div className="student-dashboard">

      {/* Sidebar */}
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

          <Link
            to="/"
            className={`sidebar-link ${
              location.pathname === "/" ? "active" : ""
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            to="/events"
            className={`sidebar-link ${
              location.pathname === "/events" ? "active" : ""
            }`}
          >
            <CalendarDays size={20} />
            Events
          </Link>

          <a className="sidebar-link">
            <ClipboardList size={20} />
            My Registrations
          </a>

          <a className="sidebar-link">
            <Bookmark size={20} />
            Saved Events
          </a>

          <a className="sidebar-link">
            <CalendarDays size={20} />
            Calendar
          </a>

          <a className="sidebar-link">
            <User size={20} />
            Profile
          </a>

          <a className="sidebar-link">
            <Bell size={20} />
            Notifications
          </a>

        </nav>

        <div className="sidebar-bottom">
          <a className="sidebar-link">
            <LogOut size={20} />
            Logout
          </a>
        </div>

      </aside>

      {/* Main */}
      <main className="dashboard-main">

        {/* Topbar */}
        <header className="dashboard-topbar">

          <div className="search-container">
            <Search size={20} />

            <input
              type="text"
              placeholder="Search events..."
            />
          </div>

          <div className="topbar-right">

            <button className="notification-button">
              <Bell size={21} />
              <span className="notification-badge">3</span>
            </button>

            <div className="student-profile">

              <div className="student-avatar">
                AP
              </div>

              <div className="student-info">
                <strong>Asha Perera</strong>
                <span>Student</span>
              </div>

            </div>

          </div>

        </header>

        {/* Page Content */}
        {children}

      </main>

    </div>
  );
}

export default StudentLayout;