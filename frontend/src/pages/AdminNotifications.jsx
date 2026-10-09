import { Bell, UsersRound, BadgeCheck, TrendingUp, Megaphone, Check, CheckCheck } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminPageHeader } from "../components/AdminUi";
import { useAdmin } from "../context/AdminContext";
import "./AdminNotifications.css";

const icons = { user: UsersRound, approval: BadgeCheck, registration: TrendingUp, announcement: Megaphone };

function AdminNotifications() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAdmin();
  const unread = notifications.filter((notification) => !notification.read).length;
  return <AdminLayout><div className="admin-page">
    <AdminPageHeader eyebrow="SYSTEM UPDATES" title="Notifications" description={unread ? `${unread} unread notifications` : "You are all caught up."} action={unread > 0 && <button className="admin-button secondary" type="button" onClick={markAllNotificationsAsRead}><CheckCheck size={14} />Mark all as read</button>} />
    <section className="admin-notification-list" aria-label="Administrator notifications">{notifications.map((notification) => { const Icon = icons[notification.type] || Bell; return <article key={notification.id} className={`admin-card admin-notification-item${notification.read ? " read" : " unread"}`}><span className="admin-notification-icon"><Icon size={17} /></span><div className="admin-notification-copy"><div className="admin-notification-title"><h2>{notification.title}</h2>{!notification.read && <span className="admin-status pending">Unread</span>}</div><p>{notification.message}</p><time>{notification.time}</time></div>{!notification.read && <button type="button" className="admin-icon-button" title="Mark as read" aria-label={`Mark ${notification.title} as read`} onClick={() => markNotificationAsRead(notification.id)}><Check size={16} /></button>}</article>; })}{!notifications.length && <div className="admin-card admin-empty">No notifications.</div>}</section>
  </div></AdminLayout>;
}

export default AdminNotifications;
