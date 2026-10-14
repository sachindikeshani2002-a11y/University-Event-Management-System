import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import StudentLayout from "../components/StudentLayout";
import EmptyState from "../components/EmptyState";
import { useStudent } from "../context/StudentContext";
import { useAuth } from "../context/AuthContext";

import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Search,
  Bookmark,
  X,
} from "lucide-react";

import "./Events.css";

function Events() {
  const { request } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") ?? "";
  const [selectedCategory, setSelectedCategory] = useState("All Events");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const { savedEvents, registeredEvents, toggleSaveEvent, registerForEvent } = useStudent();

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const result = await request("/api/events");
      setEvents((result.events || []).map((event) => {
        const eventDate = new Date(event.date);
        const date = eventDate.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
        const formatTime = (value) => value ? new Date(`1970-01-01T${value}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";
        const categoryClass = event.category === "Workshops" ? "workshop" : event.category.toLowerCase();
        return {
          ...event,
          id: event._id || event.id,
          date,
          time: `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`,
          location: event.location,
          participants: event.capacity ? `${event.registrationCount || 0} / ${event.capacity} participants` : `${event.registrationCount || 0} participants`,
          bannerClass: `${categoryClass}-banner`,
        };
      }));
    } catch (error) {
      setLoadError(error.message || "Unable to load events.");
    } finally {
      setIsLoading(false);
    }
  }, [request]);

  useEffect(() => { Promise.resolve().then(loadEvents); }, [loadEvents]);

  useEffect(() => {
    const selectedId = searchParams.get("event");
    if (selectedId) Promise.resolve().then(() => setSelectedEvent(events.find((event) => String(event.id) === selectedId) || null));
  }, [events, searchParams]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Events" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const openEventDetails = (event) => {
    setSelectedEvent(event);
    setRegistrationMessage("");
    setSearchParams((current) => { const next = new URLSearchParams(current); next.set("event", event.id); return next; });
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
    setRegistrationMessage("");
    setSearchParams((current) => { const next = new URLSearchParams(current); next.delete("event"); return next; });
  };

  const handleRegister = async (eventId) => {
    if (registeredEvents.includes(eventId)) {
      setRegistrationMessage("You are already registered for this event.");
      return;
    }

    setIsRegistering(true);
    try {
      await registerForEvent(eventId);
      setRegistrationMessage("You have successfully registered for this event.");
      await loadEvents();
    } catch (error) {
      setRegistrationMessage(error.message || "Unable to register for this event.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      if (value) nextParams.set("search", value);
      else nextParams.delete("search");
      return nextParams;
    }, { replace: true });
  };

  return (
    <StudentLayout>
      <div className="events-page">
        <div className="events-header">
          <div>
            <h1>Events</h1>
            <p>Discover and join upcoming university events.</p>
          </div>

          <div className="events-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="event-filters">
          {["All Events", "Technology", "Workshops", "Career", "Academic"].map((category) => (
            <button
              key={category}
              className={`filter ${selectedCategory === category ? "active" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="events-grid">
          {isLoading ? <div className="no-events" role="status">Loading events...</div> : loadError ? <div className="no-events" role="alert">{loadError}<button type="button" onClick={loadEvents}>Try again</button></div> : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const isSaved = savedEvents.includes(event.id);

              return (
                <div className="event-item" key={event.id}>
                  <div className={`event-banner ${event.bannerClass}`}>
                    <span>{event.category.toUpperCase()}</span>

                    <button
                      className={`save-button ${isSaved ? "saved" : ""}`}
                      onClick={() => toggleSaveEvent(event.id)}
                      title={isSaved ? "Remove from saved events" : "Save event"}
                    >
                      <Bookmark
                        size={18}
                        fill={isSaved ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  <div className="event-body">
                    <h2>{event.title}</h2>
                    <p className="event-description">{event.description}</p>

                    <div className="event-details">
                      <div>
                        <CalendarDays size={16} />
                        {event.date}
                      </div>

                      <div>
                        <Clock size={16} />
                        {event.time}
                      </div>

                      <div>
                        <MapPin size={16} />
                        {event.location}
                      </div>

                      <div>
                        <Users size={16} />
                        {event.participants}
                      </div>
                    </div>

                    <button className="view-event-button" onClick={() => openEventDetails(event)}>
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyState title="No events found" description="Try a different search or category." />
          )}
        </div>

        {selectedEvent && (
          <div className="event-modal-overlay" onClick={closeEventDetails}>
            <div className="event-modal" onClick={(e) => e.stopPropagation()}>
              <div className={`event-modal-banner ${selectedEvent.bannerClass}`}>
                <span>{selectedEvent.category.toUpperCase()}</span>

                <button className="modal-close-button" onClick={closeEventDetails}>
                  <X size={20} />
                </button>
              </div>

              <div className="event-modal-content">
                <h2>{selectedEvent.title}</h2>
                <p className="modal-description">{selectedEvent.description}</p>

                <div className="modal-details">
                  <div>
                    <CalendarDays size={19} />
                    <div>
                      <strong>Date</strong>
                      <span>{selectedEvent.date}</span>
                    </div>
                  </div>

                  <div>
                    <Clock size={19} />
                    <div>
                      <strong>Time</strong>
                      <span>{selectedEvent.time}</span>
                    </div>
                  </div>

                  <div>
                    <MapPin size={19} />
                    <div>
                      <strong>Location</strong>
                      <span>{selectedEvent.location}</span>
                    </div>
                  </div>

                  <div>
                    <Users size={19} />
                    <div>
                      <strong>Participants</strong>
                      <span>{selectedEvent.participants}</span>
                    </div>
                  </div>
                </div>

                {registrationMessage && (
                  <div className="registration-success">✓ {registrationMessage}</div>
                )}

                <button
                  className="register-event-button"
                  onClick={() => handleRegister(selectedEvent.id)}
                  disabled={isRegistering || registeredEvents.includes(String(selectedEvent.id)) || registeredEvents.includes(selectedEvent.id)}
                >
                  {isRegistering ? "Registering..." : (registeredEvents.includes(String(selectedEvent.id)) || registeredEvents.includes(selectedEvent.id))
                    ? "Already Registered"
                    : "Register for Event"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default Events;
