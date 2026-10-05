import { Link } from "react-router-dom";

import events from "../data/events";

import {
  CalendarDays,
  ClipboardList,
  Bookmark,
  Bell,
  MapPin,
  Clock,
  Users,
  ChevronRight,
} from "lucide-react";

import StudentLayout from "../components/StudentLayout";
import "./StudentDashboard.css";

function StudentDashboard() {

  // Get the first 3 events for the dashboard
  const upcomingEvents = events.slice(0, 3);

  return (
    <StudentLayout>

      {/* Dashboard Content */}
      <div className="dashboard-content">

        {/* =========================
            Welcome
        ========================= */}

        <section className="welcome-area">

          <h1>
            Welcome back, Asha! 👋
          </h1>

          <p>
            Discover events, connect with others, and make the most
            of your university experience.
          </p>

        </section>


        {/* =========================
            Statistics
        ========================= */}

        <section className="statistics-grid">

          {/* Total Events */}
          <div className="stat-card blue-card">

            <div className="stat-icon">
              <CalendarDays size={22} />
            </div>

            <div>
              <span>Total Events</span>
              <h2>24</h2>
              <small>Available events</small>
            </div>

          </div>


          {/* Registered Events */}
          <div className="stat-card green-card">

            <div className="stat-icon">
              <ClipboardList size={22} />
            </div>

            <div>
              <span>Registered Events</span>
              <h2>8</h2>
              <small>My registrations</small>
            </div>

          </div>


          {/* Saved Events */}
          <div className="stat-card purple-card">

            <div className="stat-icon">
              <Bookmark size={22} />
            </div>

            <div>
              <span>Saved Events</span>
              <h2>6</h2>
              <small>Saved for later</small>
            </div>

          </div>


          {/* Upcoming Events */}
          <div className="stat-card orange-card">

            <div className="stat-icon">
              <CalendarDays size={22} />
            </div>

            <div>
              <span>Upcoming Events</span>
              <h2>{upcomingEvents.length}</h2>
              <small>Coming soon</small>
            </div>

          </div>

        </section>


        {/* =========================
            Main Grid
        ========================= */}

        <div className="dashboard-grid">


          {/* =========================
              Upcoming Events
          ========================= */}

          <section className="events-section">

            <div className="section-title">

              <div>

                <h2>
                  Upcoming Events
                </h2>

                <p>
                  Events you might be interested in
                </p>

              </div>


              <Link to="/events">
                View All
                <ChevronRight size={17} />
              </Link>

            </div>


            {/* Dynamic Events */}

            {upcomingEvents.map((event) => (

              <div
                className="event-card"
                key={event.id}
              >

                {/* Event Date */}

                <div className="event-date">

                  <strong>
                    {event.date
                      .split(" ")[1]
                      .replace(",", "")}
                  </strong>

                  <span>
                    {event.date
                      .split(" ")[0]
                      .substring(0, 3)
                      .toUpperCase()}
                  </span>

                </div>


                {/* Event Content */}

                <div className="event-content">

                  {/* Category */}

                  <span
                    className={`event-category ${
                      event.category === "Technology"
                        ? "technology"
                        : event.category === "Workshops"
                        ? "workshop"
                        : event.category === "Career"
                        ? "career"
                        : ""
                    }`}
                  >
                    {event.category.toUpperCase()}
                  </span>


                  {/* Event Title */}

                  <h3>
                    {event.title}
                  </h3>


                  {/* Event Information */}

                  <div className="event-information">

                    <span>
                      <MapPin size={14} />
                      {event.location}
                    </span>


                    <span>
                      <Clock size={14} />
                      {event.time}
                    </span>


                    <span>
                      <Users size={14} />
                      {event.participants}
                    </span>

                  </div>

                </div>


                {/* Details Button */}

                <Link
                  to="/events"
                  className="details-button"
                >
                  Details
                </Link>

              </div>

            ))}

          </section>


          {/* =========================
              Right Column
          ========================= */}

          <aside className="right-dashboard">


            {/* =========================
                Calendar
            ========================= */}

            <div className="calendar-card">

              <div className="calendar-header">

                <h2>
                  My Calendar
                </h2>

                <div>
                  October 2026
                </div>

              </div>


              {/* Week Days */}

              <div className="calendar-week">

                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>

              </div>


              {/* Calendar Days */}

              <div className="calendar-days">

                <span className="muted">
                  27
                </span>

                <span className="muted">
                  28
                </span>

                <span className="muted">
                  29
                </span>

                <span className="muted">
                  30
                </span>


                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>


                <span className="selected-day">
                  5
                </span>

                <span>6</span>
                <span>7</span>

                <span className="event-day">
                  8
                </span>

                <span>9</span>
                <span>10</span>


                <span>11</span>

                <span className="event-day">
                  12
                </span>

                <span>13</span>
                <span>14</span>
                <span>15</span>
                <span>16</span>
                <span>17</span>


                <span>18</span>
                <span>19</span>
                <span>20</span>
                <span>21</span>
                <span>22</span>
                <span>23</span>
                <span>24</span>


                <span>25</span>
                <span>26</span>
                <span>27</span>
                <span>28</span>
                <span>29</span>
                <span>30</span>
                <span>31</span>

              </div>

            </div>


            {/* =========================
                Announcements
            ========================= */}

            <div className="announcements-card">

              <div className="announcement-title">

                <h2>
                  Recent Announcements
                </h2>

                <button>
                  View All
                </button>

              </div>


              {/* Announcement 1 */}

              <div className="announcement">

                <div className="announcement-icon">
                  <Bell size={16} />
                </div>

                <div>

                  <strong>
                    New events added
                  </strong>

                  <p>
                    5 new university events are available.
                  </p>

                  <small>
                    2 hours ago
                  </small>

                </div>

              </div>


              {/* Announcement 2 */}

              <div className="announcement">

                <div className="announcement-icon">
                  <Bell size={16} />
                </div>

                <div>

                  <strong>
                    Registration reminder
                  </strong>

                  <p>
                    Don't forget to register for upcoming events.
                  </p>

                  <small>
                    Yesterday
                  </small>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </StudentLayout>
  );
}

export default StudentDashboard;