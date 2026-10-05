import { useMemo, useState } from "react";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import StudentLayout from "../components/StudentLayout";
import events from "../data/events";
import "./Calendar.css";

const CALENDAR_YEAR = 2026;
const CALENDAR_MONTH = 9;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dateKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function Calendar() {
  const calendarDays = useMemo(() => {
    const firstWeekday = new Date(CALENDAR_YEAR, CALENDAR_MONTH, 1).getDay();
    const daysInMonth = new Date(CALENDAR_YEAR, CALENDAR_MONTH + 1, 0).getDate();
    const days = Array(firstWeekday).fill(null);

    for (let day = 1; day <= daysInMonth; day += 1) {
      days.push(new Date(CALENDAR_YEAR, CALENDAR_MONTH, day));
    }

    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, []);

  const octoberEvents = useMemo(
    () =>
      events.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getFullYear() === CALENDAR_YEAR &&
          eventDate.getMonth() === CALENDAR_MONTH
        );
      }),
    []
  );

  const eventDates = useMemo(
    () => new Set(octoberEvents.map((event) => dateKey(new Date(event.date)))),
    [octoberEvents]
  );

  const firstEventDate = octoberEvents
    .map((event) => new Date(event.date))
    .sort((first, second) => first - second)[0];
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    if (today.getFullYear() === CALENDAR_YEAR && today.getMonth() === CALENDAR_MONTH) {
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }
    return firstEventDate || new Date(CALENDAR_YEAR, CALENDAR_MONTH, 1);
  });

  const selectedEvents = octoberEvents.filter(
    (event) => dateKey(new Date(event.date)) === dateKey(selectedDate)
  );

  return (
    <StudentLayout>
      <div className="calendar-page">
        <header className="calendar-page-header">
          <div>
            <span className="calendar-eyebrow">University events</span>
            <h1>Event Calendar</h1>
            <p>Browse events scheduled throughout October.</p>
          </div>
          <div className="calendar-month-label">
            <CalendarDays size={18} aria-hidden="true" />
            October 2026
          </div>
        </header>

        <div className="calendar-page-grid">
          <section className="calendar-grid-card" aria-label="October 2026 calendar">
            <div className="calendar-weekdays">
              {WEEKDAYS.map((weekday) => (
                <span key={weekday}>{weekday}</span>
              ))}
            </div>
            <div className="calendar-date-grid">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <span key={`blank-${index}`} className="calendar-blank" aria-hidden="true" />;
                }

                const key = dateKey(day);
                const hasEvents = eventDates.has(key);
                const isSelected = dateKey(selectedDate) === key;

                return (
                  <button
                    key={key}
                    type="button"
                    className={`calendar-date${isSelected ? " is-selected" : ""}${hasEvents ? " has-events" : ""}`}
                    onClick={() => setSelectedDate(day)}
                    aria-pressed={isSelected}
                    aria-label={`${day.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}${hasEvents ? ", events scheduled" : ""}`}
                  >
                    <span>{day.getDate()}</span>
                    {hasEvents && <span className="calendar-event-dot" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
            <div className="calendar-legend">
              <span className="calendar-event-dot" aria-hidden="true" />
              Event scheduled
            </div>
          </section>

          <section className="calendar-agenda-card" aria-live="polite">
            <div className="calendar-agenda-heading">
              <span>Selected date</span>
              <h2>
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>
            </div>

            {selectedEvents.length ? (
              <div className="calendar-agenda-list">
                {selectedEvents.map((event) => (
                  <article className="calendar-agenda-event" key={event.id}>
                    <span className="calendar-agenda-category">{event.category}</span>
                    <h3>{event.title}</h3>
                    <p><Clock3 size={15} aria-hidden="true" />{event.time}</p>
                    <p><MapPin size={15} aria-hidden="true" />{event.location}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="calendar-no-events">No events scheduled for this date</p>
            )}
          </section>
        </div>
      </div>
    </StudentLayout>
  );
}

export default Calendar;