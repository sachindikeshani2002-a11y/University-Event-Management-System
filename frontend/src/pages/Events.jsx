import StudentLayout from "../components/StudentLayout";

import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Search,
  Bookmark,
} from "lucide-react";

import "./Events.css";

function Events() {
  return (
    <StudentLayout>

      <div className="events-page">

        {/* Header */}
        <div className="events-header">

          <div>
            <h1>Events</h1>
            <p>
              Discover and join upcoming university events.
            </p>
          </div>

          <div className="events-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search events..."
            />
          </div>

        </div>

        {/* Filters */}
        <div className="event-filters">

          <button className="filter active">
            All Events
          </button>

          <button className="filter">
            Technology
          </button>

          <button className="filter">
            Workshops
          </button>

          <button className="filter">
            Career
          </button>

          <button className="filter">
            Academic
          </button>

        </div>

        {/* Events Grid */}
        <div className="events-grid">

          {/* Event 1 */}
          <div className="event-item">

            <div className="event-banner technology-banner">

              <span>TECHNOLOGY</span>

              <button className="save-button">
                <Bookmark size={18} />
              </button>

            </div>

            <div className="event-body">

              <h2>
                University Tech Conference 2026
              </h2>

              <p className="event-description">
                Explore the latest technologies and innovations
                with industry experts and university students.
              </p>

              <div className="event-details">

                <div>
                  <CalendarDays size={16} />
                  October 05, 2026
                </div>

                <div>
                  <Clock size={16} />
                  9:00 AM - 4:00 PM
                </div>

                <div>
                  <MapPin size={16} />
                  Engineering Faculty
                </div>

                <div>
                  <Users size={16} />
                  120 Participants
                </div>

              </div>

              <button className="view-event-button">
                View Details
              </button>

            </div>

          </div>

          {/* Event 2 */}
          <div className="event-item">

            <div className="event-banner workshop-banner">

              <span>WORKSHOP</span>

              <button className="save-button">
                <Bookmark size={18} />
              </button>

            </div>

            <div className="event-body">

              <h2>
                Introduction to Artificial Intelligence
              </h2>

              <p className="event-description">
                Learn the fundamentals of Artificial Intelligence
                and its applications in the real world.
              </p>

              <div className="event-details">

                <div>
                  <CalendarDays size={16} />
                  October 08, 2026
                </div>

                <div>
                  <Clock size={16} />
                  10:00 AM - 1:00 PM
                </div>

                <div>
                  <MapPin size={16} />
                  ICT Auditorium
                </div>

                <div>
                  <Users size={16} />
                  80 Participants
                </div>

              </div>

              <button className="view-event-button">
                View Details
              </button>

            </div>

          </div>

          {/* Event 3 */}
          <div className="event-item">

            <div className="event-banner career-banner">

              <span>CAREER</span>

              <button className="save-button">
                <Bookmark size={18} />
              </button>

            </div>

            <div className="event-body">

              <h2>
                Career & Internship Fair
              </h2>

              <p className="event-description">
                Meet leading companies and discover internship
                and career opportunities.
              </p>

              <div className="event-details">

                <div>
                  <CalendarDays size={16} />
                  October 12, 2026
                </div>

                <div>
                  <Clock size={16} />
                  9:00 AM - 3:00 PM
                </div>

                <div>
                  <MapPin size={16} />
                  University Main Hall
                </div>

                <div>
                  <Users size={16} />
                  250 Participants
                </div>

              </div>

              <button className="view-event-button">
                View Details
              </button>

            </div>

          </div>

        </div>

      </div>

    </StudentLayout>
  );
}

export default Events;