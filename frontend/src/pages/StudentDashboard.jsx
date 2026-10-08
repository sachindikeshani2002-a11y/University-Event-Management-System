import { useMemo, useState } from "react";
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
import { useStudent } from "../context/StudentContext";
import "./StudentDashboard.css";

const CALENDAR_YEAR = 2026;
const CALENDAR_MONTH = 9;

function StudentDashboard() {
  const { savedEvents, registeredEvents } = useStudent();

  const upcomingEvents = events.slice(0, 3);
  const totalEvents = events.length;
  const upcomingEventCount = upcomingEvents.length;

  const eventDateMap = useMemo(() => {
    const dateMap = new Map();

    events.forEach((event) => {
      const eventDate = new Date(event.date);
      dateMap.set(eventDate.toDateString(), true);
    });

    return dateMap;
  }, []);

  const getDateKey = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).toDateString();

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(CALENDAR_YEAR, CALENDAR_MONTH, 1);
    const firstDayIndex = firstDayOfMonth.getDay();
    const lastDayOfMonth = new Date(CALENDAR_YEAR, CALENDAR_MONTH + 1, 0);
    const totalDays = lastDayOfMonth.getDate();
    const days = [];

    for (let i = 0; i < firstDayIndex; i += 1) {
      days.push(null);
    }

    for (let day = 1; day <= totalDays; day += 1) {
      days.push(new Date(CALENDAR_YEAR, CALENDAR_MONTH, day));
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  }, []);

  const firstEventDate = useMemo(() => {
    const sortedDates = events
      .map((event) => new Date(event.date))
      .sort((a, b) => a - b);

    return sortedDates[0];
  }, []);

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();

    if (today.getFullYear() === CALENDAR_YEAR && today.getMonth() === CALENDAR_MONTH) {
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }

    return firstEventDate;
  });

  const selectedDateKey = getDateKey(selectedDate);

  const selectedEvents = useMemo(
    () =>
      events.filter((event) => {
        const eventDate = new Date(event.date);
        return getDateKey(eventDate) === selectedDateKey;
      }),
    [selectedDateKey]
  );

  const today = new Date();
  const isCurrentCalendarMonth =
    today.getFullYear() === CALENDAR_YEAR && today.getMonth() === CALENDAR_MONTH;

  return (
    <StudentLayout>
      <div className="dashboard-content">
        <section className="welcome-area">
          <h1>Welcome back, Asha! 👋</h1>

          <p>
            Discover events, connect with others, and make the most of your
            university experience.
          </p>
        </section>

        <section className="statistics-grid">
          <div className="stat-card blue-card">
            <div className="stat-icon">
              <CalendarDays size={22} />
            </div>

            <div>
              <span>Total Events</span>
              <h2>{totalEvents}</h2>
              <small>Available events</small>
            </div>
          </div>

          <div className="stat-card green-card">
            <div className="stat-icon">
              <ClipboardList size={22} />
            </div>

            <div>
              <span>Registered Events</span>
              <h2>{registeredEvents.length}</h2>
              <small>My registrations</small>
            </div>
          </div>

          <div className="stat-card purple-card">
            <div className="stat-icon">
              <Bookmark size={22} />
            </div>

            <div>
              <span>Saved Events</span>
              <h2>{savedEvents.length}</h2>
              <small>Saved for later</small>
            </div>
          </div>

          <div className="stat-card orange-card">
            <div className="stat-icon">
              <CalendarDays size={22} />
            </div>

            <div>
              <span>Upcoming Events</span>
              <h2>{upcomingEventCount}</h2>
              <small>Coming soon</small>
            </div>
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="events-section">
            <div className="section-title">
              <div>
                <h2>Upcoming Events</h2>
                <p>Events you might be interested in</p>
              </div>

              <Link to="/events">
                View All
                <ChevronRight size={17} />
              </Link>
            </div>

            {upcomingEvents.map((event) => (
              <div className="event-card" key={event.id}>
                <div className="event-date">
                  <strong>{event.date.split(" ")[1].replace(",", "")}</strong>
                  <span>{event.date.split(" ")[0].substring(0, 3).toUpperCase()}</span>
                </div>

                <div className="event-content">
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

                  <h3>{event.title}</h3>

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

                <Link to="/events" className="details-button">
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
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return (
                      <span key={`empty-${index}`} className="muted" aria-hidden="true">
                        &nbsp;
                      </span>
                    );
                  }

                  const dateKey = getDateKey(day);
                  const isSelected = selectedDateKey === dateKey;
                  const isEventDay = eventDateMap.has(dateKey);
                  const isToday =
                    isCurrentCalendarMonth && getDateKey(today) === dateKey;

                  const dayClasses = ["calendar-day"];

                  if (isSelected || isToday) {
                    dayClasses.push("selected-day");
                  } else if (isEventDay) {
                    dayClasses.push("event-day");
                  }

                  return (
                    <button
                      key={dateKey}
                      type="button"
                      className={dayClasses.join(" ")}
                      onClick={() => setSelectedDate(day)}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>

              <div className="calendar-selected-events">
                <h3>
                  Events on {selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h3>

                {selectedEvents.length > 0 ? (
                  <div className="calendar-event-list">
                    {selectedEvents.map((event) => (
                      <div className="calendar-event-item" key={event.id}>
                        <h4>{event.title}</h4>
                        <span className="calendar-event-category">
                          {event.category}
                        </span>
                        <p>{event.time}</p>
                        <p>{event.location}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="calendar-empty-state">
                    No events scheduled for this date.
                  </p>
                )}
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