import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, UsersRound, GraduationCap, BriefcaseBusiness, CalendarDays,
  BadgeCheck, ClipboardList, ChartNoAxesColumnIncreasing, Megaphone, Bell,
  Activity, UserRound, LogOut, Menu, X, GraduationCap as Cap,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import "./AdminLayout.css";

const navigation = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", icon: UsersRound },
  { label: "Students", to: "/admin/students", icon: GraduationCap },
  { label: "Organizers", to: "/admin/organizers", icon: BriefcaseBusiness },
  { label: "Events", to: "/admin/events", icon: CalendarDays },
  { label: "Event Approvals", to: "/admin/event-approvals", icon: BadgeCheck },
  { label: "Registrations", to: "/admin/registrations", icon: ClipboardList },
  { label: "Analytics", to: "/admin/analytics", icon: ChartNoAxesColumnIncreasing },
  { label: "Announcements", to: "/admin/announcements", icon: Megaphone },
  { label: "Notifications", to: "/admin/notifications", icon: Bell },
  { label: "Activity Logs", to: "/admin/activity", icon: Activity },
  { label: "Profile", to: "/admin/profile", icon: UserRound },
];

function isActiveRoute(pathname, to) {
  if (to === "/admin") return pathname === "/admin";
  if (to === "/admin/events") return pathname === to || (pathname.startsWith("/admin/events/") && pathname !== "/admin/event-approvals");
  return pathname === to;
}

function AdminLayout({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications } = useAdmin();
  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <div className="admin-portal">
      <aside className={`admin-sidebar${mobileNavOpen ? " is-open" : ""}`}>
        <Link className="admin-brand" to="/admin" onClick={() => setMobileNavOpen(false)}>
          <span className="admin-brand-mark"><Cap size={24} aria-hidden="true" /></span>
          <span className="admin-brand-copy"><strong>University Event</strong><span>Management System</span></span>
        </Link>
        <nav className="admin-navigation" aria-label="Administration navigation">
          <span className="admin-nav-caption">SYSTEM ADMINISTRATION</span>
          {navigation.map(({ label, to, icon: Icon }) => {
            const active = isActiveRoute(location.pathname, to);
            return <Link key={to} to={to} className={`admin-nav-link${active ? " active" : ""}`} aria-current={active ? "page" : undefined} onClick={() => setMobileNavOpen(false)}>
              <Icon size={17} aria-hidden="true" /><span>{label}</span>
            </Link>;
          })}
        </nav>
        <div className="admin-sidebar-footer">
          <button type="button" className="admin-nav-link admin-logout" onClick={() => setLogoutMessage("Logout functionality will be connected when authentication is implemented.")}><LogOut size={17} aria-hidden="true" /><span>Logout</span></button>
          {logoutMessage && <p className="admin-logout-message">{logoutMessage}</p>}
        </div>
      </aside>

      {mobileNavOpen && <button className="admin-nav-backdrop" type="button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}

      <main className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu-button" type="button" aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"} onClick={() => setMobileNavOpen((open) => !open)}>{mobileNavOpen ? <X size={19} /> : <Menu size={19} />}</button>
          <div className="admin-topbar-right">
            <button className="admin-notification-button" type="button" aria-label={`View notifications${unreadCount ? `, ${unreadCount} unread` : ""}`} title="View notifications" onClick={() => navigate("/admin/notifications")}>
              <Bell size={19} aria-hidden="true" />{unreadCount > 0 && <span className="admin-notification-badge">{unreadCount}</span>}
            </button>
            <Link className="admin-user-summary" to="/admin/profile" aria-label="Admin profile: Admin User">
              <span className="admin-avatar">AD</span><span className="admin-user-copy"><strong>Admin User</strong><span>Administrator</span></span>
            </Link>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
