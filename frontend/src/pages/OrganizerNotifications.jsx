import { Bell, ClipboardList, CalendarDays, TrendingUp, Clock3, Check } from "lucide-react";
import OrganizerLayout from "../components/OrganizerLayout";
import { useOrganizer } from "../context/OrganizerContext";
import "./OrganizerNotifications.css";

const notificationIcons = {
  registration: ClipboardList,
  event: CalendarDays,
  milestone: TrendingUp,
  reminder: Clock3,
};

function OrganizerNotifications() {
  const { notifications, markNotificationAsRead } = useOrganizer();
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <OrganizerLayout>
      <div className="organizer-page">
        <header className="organizer-page-header"><div><span className="organizer-eyebrow">UPDATES</span><h1>Notifications</h1><p>{unreadCount ? `${unreadCount} unread updates` : "You're all caught up."}</p></div></header>
        <section className="organizer-notification-list" aria-label="Organizer notifications">
          {notifications.map((notification) => {
            const Icon = notificationIcons[notification.type] || Bell;
            return <article className={`organizer-card organizer-notification-card${notification.read ? " is-read" : " is-unread"}`} key={notification.id}>
              <span className="organizer-notification-icon"><Icon size={18} /></span>
              <div className="organizer-notification-copy"><div className="organizer-notification-title"><h2>{notification.title}</h2>{!notification.read && <span className="organizer-status unread">Unread</span>}</div><p>{notification.message}</p><time>{notification.time}</time></div>
              {!notification.read && <button className="organizer-icon-button" type="button" onClick={() => markNotificationAsRead(notification.id)} aria-label={`Mark ${notification.title} as read`} title="Mark as read"><Check size={17} /></button>}
            </article>;
          })}
          {!notifications.length && <div className="organizer-card organizer-empty-state">No notifications yet.</div>}
        </section>
      </div>
    </OrganizerLayout>
  );
}

export default OrganizerNotifications;
