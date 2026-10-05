import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Users } from "lucide-react";
import StudentLayout from "../components/StudentLayout";
import events from "../data/events";
import { useStudent } from "../context/StudentContext";
import "./MyRegistrations.css";

function MyRegistrations() {
  const { registeredEvents } = useStudent();

  const registeredEventDetails = events.filter((event) =>
    registeredEvents.includes(event.id)
  );

  return (
    <StudentLayout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1>My Registrations</h1>
            <p>Events you have signed up for.</p>
          </div>
        </div>

        {registeredEventDetails.length === 0 ? (
          <div className="empty-state-card">
            <h2>No registered events yet.</h2>
            <p>Explore events and register for the ones you are interested in.</p>
            <Link to="/events" className="primary-action-button">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="list-grid">
            {registeredEventDetails.map((event) => (
              <div className="info-card" key={event.id}>
                <div className={`info-card-banner ${event.bannerClass}`}>
                  <span>{event.category.toUpperCase()}</span>
                </div>

                <div className="info-card-body">
                  <h2>{event.title}</h2>

                  <div className="info-meta">
                    <span>
                      <CalendarDays size={15} />
                      {event.date}
                    </span>
                    <span>
                      <MapPin size={15} />
                      {event.location}
                    </span>
                    <span>
                      <Users size={15} />
                      {event.participants}
                    </span>
                  </div>

                  <p>{event.description}</p>

                  <Link to="/events" className="secondary-link-button">
                    View Event
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default MyRegistrations;
