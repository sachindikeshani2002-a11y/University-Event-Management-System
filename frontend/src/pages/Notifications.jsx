import { Bell } from "lucide-react";
import StudentLayout from "../components/StudentLayout";
import "./Notifications.css";

const notifications = [
  {
    title: "New events added",
    description: "5 new university events are available.",
    time: "2 hours ago",
  },
  {
    title: "Registration reminder",
    description: "Don't forget to register for upcoming events.",
    time: "Yesterday",
  },
  {
    title: "Workshop seats filling fast",
    description: "Some workshops are reaching capacity. Register early.",
    time: "3 days ago",
  },
];

function Notifications() {
  return (
    <StudentLayout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1>Notifications</h1>
            <p>Latest updates from the university.</p>
          </div>
        </div>

        <div className="notifications-card">
          {notifications.map((notification) => (
            <div className="notification-item" key={notification.title}>
              <div className="notification-icon">
                <Bell size={16} />
              </div>

              <div className="notification-copy">
                <strong>{notification.title}</strong>
                <p>{notification.description}</p>
                <small>{notification.time}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
}

export default Notifications;
