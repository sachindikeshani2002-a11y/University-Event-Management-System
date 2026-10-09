import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Plus,
  ClipboardList,
  ChartNoAxesColumnIncreasing,
  Megaphone,
  Bell,
  UserRound,
  LogOut,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";
import { useOrganizer } from "../context/OrganizerContext";
import { useAuth } from "../context/AuthContext";
import "./OrganizerLayout.css";

const navigation = [
  { label: "Dashboard", to: "/organizer", icon: LayoutDashboard },
  { label: "My Events", to: "/organizer/events", icon: CalendarDays },
  { label: "Create Event", to: "/organizer/events/create", icon: Plus },
  { label: "Registrations", to: "/organizer/registrations", icon: ClipboardList },
  { label: "Analytics", to: "/organizer/analytics", icon: ChartNoAxesColumnIncreasing },
  { label: "Announcements", to: "/organizer/announcements", icon: Megaphone },
  { label: "Notifications", to: "/organizer/notifications", icon: Bell },
  { label: "Profile", to: "/organizer/profile", icon: UserRound },
];

function routeIsActive(pathname, to) {
  if (to === "/organizer") return pathname === to;
  if (to === "/organizer/events") {
    return pathname === to || (pathname.startsWith("/organizer/events/") && !pathname.startsWith("/organizer/events/create"));
  }
  return pathname === to;
}

function OrganizerLayout({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications } = useOrganizer();
  const { logout } = useAuth();
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="organizer-shell">
      <aside className={`organizer-sidebar${mobileNavOpen ? " is-open" : ""}`}>
        <Link className="organizer-brand" to="/organizer" onClick={() => setMobileNavOpen(false)}>
          <span className="organizer-brand-mark"><GraduationCap size={25} aria-hidden="true" /></span>
          <span className="organizer-brand-copy">
            <strong>University Event</strong>
            <span>Management System</span>
          </span>
        </Link>

        <nav className="organizer-navigation" aria-label="Organizer navigation">
          <span className="organizer-nav-label">WORKSPACE</span>
          {navigation.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`organizer-nav-link${routeIsActive(location.pathname, to) ? " active" : ""}`}
              aria-current={routeIsActive(location.pathname, to) ? "page" : undefined}
              onClick={() => setMobileNavOpen(false)}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="organizer-sidebar-footer">
          <button className="organizer-nav-link organizer-logout" type="button" onClick={() => { logout(); navigate("/login", { replace: true }); }}>
            <LogOut size={18} aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {mobileNavOpen && (
        <button
          className="organizer-nav-scrim"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <main className="organizer-main">
        <header className="organizer-topbar">
          <button
            className="organizer-menu-button"
            type="button"
            aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="organizer-topbar-right">
            <button
              className="organizer-notification-button"
              type="button"
              aria-label={`View notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
              title="View notifications"
              onClick={() => navigate("/organizer/notifications")}
            >
              <Bell size={20} aria-hidden="true" />
              {unreadCount > 0 && <span className="organizer-notification-badge">{unreadCount}</span>}
            </button>
            <Link className="organizer-user" to="/organizer/profile" aria-label="Organizer profile: Alex Perera">
              <span className="organizer-avatar">AO</span>
              <span className="organizer-user-copy">
                <strong>Alex Perera</strong>
                <span>Organizer</span>
              </span>
            </Link>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

export default OrganizerLayout;
