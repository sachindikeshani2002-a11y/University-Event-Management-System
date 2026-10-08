import { Link } from "react-router-dom";
import { Bookmark, CalendarDays, MapPin, Users, Trash2 } from "lucide-react";
import StudentLayout from "../components/StudentLayout";
import events from "../data/events";
import { useStudent } from "../context/StudentContext";
import "./SavedEvents.css";

function SavedEvents() {
  const { savedEvents, toggleSaveEvent } = useStudent();

  const savedEventDetails = events.filter((event) =>
    savedEvents.includes(event.id)
  );

  return (
    <StudentLayout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1>Saved Events</h1>
            <p>Events you saved for later.</p>
          </div>
        </div>

        {savedEventDetails.length === 0 ? (
          <div className="empty-state-card">
            <h2>No saved events yet.</h2>
            <p>Save events that you want to check later.</p>
            <Link to="/events" className="primary-action-button">
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="list-grid">
            {savedEventDetails.map((event) => (
              <div className="info-card" key={event.id}>
                <div className={`info-card-banner ${event.bannerClass}`}>
                  <span>{event.category.toUpperCase()}</span>
                  <button
                    type="button"
                    className="remove-save-button"
                    onClick={() => toggleSaveEvent(event.id)}
                    title="Remove from saved events"
                  >
                    <Trash2 size={16} />
                  </button>
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

                  <div className="card-actions">
                    <Link to="/events" className="secondary-link-button">
                      View Event
                    </Link>
                    <button
                      type="button"
                      className="link-button danger-button"
                      onClick={() => toggleSaveEvent(event.id)}
                    >
                      <Bookmark size={15} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default SavedEvents;
