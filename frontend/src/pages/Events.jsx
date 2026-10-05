import { useState } from "react";
import StudentLayout from "../components/StudentLayout";
import events from "../data/events";

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
  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Selected category
  const [selectedCategory, setSelectedCategory] =
    useState("All Events");

  // Saved events
  const [savedEvents, setSavedEvents] = useState([]);

  // Selected event for details modal
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Registered events
  const [registeredEvents, setRegisteredEvents] = useState([]);

  // Registration success message
  const [registrationMessage, setRegistrationMessage] =
    useState("");

  // Search + category filtering
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      event.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Events" ||
      event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Save / unsave event
  const toggleSaveEvent = (eventId) => {
    setSavedEvents((currentSavedEvents) => {
      if (currentSavedEvents.includes(eventId)) {
        return currentSavedEvents.filter(
          (id) => id !== eventId
        );
      }

      return [...currentSavedEvents, eventId];
    });
  };

  // Open event details
  const openEventDetails = (event) => {
    setSelectedEvent(event);
    setRegistrationMessage("");
  };

  // Close event details
  const closeEventDetails = () => {
    setSelectedEvent(null);
    setRegistrationMessage("");
  };

  // Register for an event
  const registerForEvent = (eventId) => {
    // Check if already registered
    if (registeredEvents.includes(eventId)) {
      setRegistrationMessage(
        "You are already registered for this event."
      );

      return;
    }

    // Add event to registered events
    setRegisteredEvents((currentRegisteredEvents) => [
      ...currentRegisteredEvents,
      eventId,
    ]);

    // Show success message
    setRegistrationMessage(
      "You have successfully registered for this event."
    );

    // Close modal after 2 seconds
    setTimeout(() => {
      setSelectedEvent(null);
      setRegistrationMessage("");
    }, 2000);
  };

  return (
    <StudentLayout>

      <div className="events-page">

        {/* =========================
            Header
        ========================= */}

        <div className="events-header">

          <div>
            <h1>Events</h1>

            <p>
              Discover and join upcoming university events.
            </p>
          </div>

          {/* Search */}
          <div className="events-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

        </div>


        {/* =========================
            Filters
        ========================= */}

        <div className="event-filters">

          {[
            "All Events",
            "Technology",
            "Workshops",
            "Career",
            "Academic",
          ].map((category) => (

            <button
              key={category}
              className={`filter ${
                selectedCategory === category
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedCategory(category)
              }
            >
              {category}
            </button>

          ))}

        </div>


        {/* =========================
            Events Grid
        ========================= */}

        <div className="events-grid">

          {filteredEvents.length > 0 ? (

            filteredEvents.map((event) => {

              const isSaved = savedEvents.includes(
                event.id
              );

              return (

                <div
                  className="event-item"
                  key={event.id}
                >

                  {/* Event Banner */}
                  <div
                    className={`event-banner ${event.bannerClass}`}
                  >

                    <span>
                      {event.category.toUpperCase()}
                    </span>

                    {/* Save Button */}
                    <button
                      className={`save-button ${
                        isSaved ? "saved" : ""
                      }`}
                      onClick={() =>
                        toggleSaveEvent(event.id)
                      }
                      title={
                        isSaved
                          ? "Remove from saved events"
                          : "Save event"
                      }
                    >

                      <Bookmark
                        size={18}
                        fill={
                          isSaved
                            ? "currentColor"
                            : "none"
                        }
                      />

                    </button>

                  </div>


                  {/* Event Body */}
                  <div className="event-body">

                    <h2>{event.title}</h2>

                    <p className="event-description">
                      {event.description}
                    </p>


                    {/* Event Details */}
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


                    {/* View Details */}
                    <button
                      className="view-event-button"
                      onClick={() =>
                        openEventDetails(event)
                      }
                    >
                      View Details
                    </button>

                  </div>

                </div>

              );

            })

          ) : (

            /* No Results */
            <div className="no-events">

              <h2>No events found</h2>

              <p>
                Try a different search or category.
              </p>

            </div>

          )}

        </div>


        {/* =========================
            Event Details Modal
        ========================= */}

        {selectedEvent && (

          <div
            className="event-modal-overlay"
            onClick={closeEventDetails}
          >

            <div
              className="event-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* Modal Banner */}
              <div
                className={`event-modal-banner ${selectedEvent.bannerClass}`}
              >

                <span>
                  {selectedEvent.category.toUpperCase()}
                </span>

                <button
                  className="modal-close-button"
                  onClick={closeEventDetails}
                >
                  <X size={20} />
                </button>

              </div>


              {/* Modal Content */}
              <div className="event-modal-content">

                <h2>
                  {selectedEvent.title}
                </h2>

                <p className="modal-description">
                  {selectedEvent.description}
                </p>


                {/* Event Information */}
                <div className="modal-details">

                  <div>

                    <CalendarDays size={19} />

                    <div>
                      <strong>Date</strong>

                      <span>
                        {selectedEvent.date}
                      </span>
                    </div>

                  </div>


                  <div>

                    <Clock size={19} />

                    <div>
                      <strong>Time</strong>

                      <span>
                        {selectedEvent.time}
                      </span>
                    </div>

                  </div>


                  <div>

                    <MapPin size={19} />

                    <div>
                      <strong>Location</strong>

                      <span>
                        {selectedEvent.location}
                      </span>
                    </div>

                  </div>


                  <div>

                    <Users size={19} />

                    <div>
                      <strong>Participants</strong>

                      <span>
                        {selectedEvent.participants}
                      </span>
                    </div>

                  </div>

                </div>


                {/* Registration Message */}
                {registrationMessage && (

                  <div className="registration-success">
                    ✓ {registrationMessage}
                  </div>

                )}


                {/* Register Button */}
                <button
                  className="register-event-button"
                  onClick={() =>
                    registerForEvent(
                      selectedEvent.id
                    )
                  }
                >

                  {registeredEvents.includes(
                    selectedEvent.id
                  )
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