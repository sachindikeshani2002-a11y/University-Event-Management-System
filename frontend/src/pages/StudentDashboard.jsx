import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Bookmark,
  User,
  Bell,
  LogOut,
  Search,
  MapPin,
  Clock,
  Users,
  ChevronRight,
} from "lucide-react";

import "./StudentDashboard.css";

function StudentDashboard() {
  return (
    <div className="student-dashboard">

      {/* Sidebar */}
      <aside className="dashboard-sidebar">

        <div className="sidebar-brand">
          <div className="brand-icon">
            <LayoutDashboard size={23} />
          </div>

          <div>
            <h2>UniEvents</h2>
            <p>University Event Management</p>
          </div>
        </div>

        <nav className="sidebar-navigation">

          <Link to="/" className="sidebar-link active">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link to="/events" className="sidebar-link">
            <CalendarDays size={20} />
            Events
          </Link>

          <a className="sidebar-link">
            <ClipboardList size={20} />
            My Registrations
          </a>

          <a className="sidebar-link">
            <Bookmark size={20} />
            Saved Events
          </a>

          <a className="sidebar-link">
            <CalendarDays size={20} />
            Calendar
          </a>

          <a className="sidebar-link">
            <User size={20} />
            Profile
          </a>

          <a className="sidebar-link">
            <Bell size={20} />
            Notifications
          </a>

        </nav>

        <div className="sidebar-bottom">
          <a className="sidebar-link">
            <LogOut size={20} />
            Logout
          </a>
        </div>

      </aside>

      {/* Main */}
      <main className="dashboard-main">

        {/* Topbar */}
        <header className="dashboard-topbar">

          <div className="search-container">
            <Search size={20} />

            <input
              type="text"
              placeholder="Search events..."
            />
          </div>

          <div className="topbar-right">

            <button className="notification-button">
              <Bell size={21} />
              <span className="notification-badge">3</span>
            </button>

            <div className="student-profile">

              <div className="student-avatar">
                AP
              </div>

              <div className="student-info">
                <strong>Asha Perera</strong>
                <span>Student</span>
              </div>

            </div>

          </div>

        </header>

        {/* Content */}
        <div className="dashboard-content">

          {/* Welcome */}
          <section className="welcome-area">

            <h1>Welcome back, Asha! 👋</h1>

            <p>
              Discover events, connect with others, and make the most
              of your university experience.
            </p>

          </section>

          {/* Statistics */}
          <section className="statistics-grid">

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

            <div className="stat-card orange-card">

              <div className="stat-icon">
                <CalendarDays size={22} />
              </div>

              <div>
                <span>Upcoming Events</span>
                <h2>3</h2>
                <small>Coming soon</small>
              </div>

            </div>

          </section>

          {/* Main Grid */}
          <div className="dashboard-grid">

            {/* Events */}
            <section className="events-section">

              <div className="section-title">

                <div>
                  <h2>Upcoming Events</h2>
                  <p>Events you might be interested in</p>
                </div>

                <Link to="/events">
                  View All <ChevronRight size={17} />
                </Link>

              </div>

              {/* Event 1 */}
              <div className="event-card">

                <div className="event-date">
                  <strong>05</strong>
                  <span>OCT</span>
                </div>

                <div className="event-content">

                  <span className="event-category technology">
                    TECHNOLOGY
                  </span>

                  <h3>University Tech Conference 2026</h3>

                  <div className="event-information">

                    <span>
                      <MapPin size={14} />
                      Engineering Faculty
                    </span>

                    <span>
                      <Clock size={14} />
                      9:00 AM - 4:00 PM
                    </span>

                    <span>
                      <Users size={14} />
                      120 Participants
                    </span>

                  </div>

                </div>

                <button className="details-button">
                  Details
                </button>

              </div>

              {/* Event 2 */}
              <div className="event-card">

                <div className="event-date">
                  <strong>08</strong>
                  <span>OCT</span>
                </div>

                <div className="event-content">

                  <span className="event-category workshop">
                    WORKSHOP
                  </span>

                  <h3>
                    Introduction to Artificial Intelligence
                  </h3>

                  <div className="event-information">

                    <span>
                      <MapPin size={14} />
                      ICT Auditorium
                    </span>

                    <span>
                      <Clock size={14} />
                      10:00 AM - 1:00 PM
                    </span>

                    <span>
                      <Users size={14} />
                      80 Participants
                    </span>

                  </div>

                </div>

                <button className="details-button">
                  Details
                </button>

              </div>

              {/* Event 3 */}
              <div className="event-card">

                <div className="event-date">
                  <strong>12</strong>
                  <span>OCT</span>
                </div>

                <div className="event-content">

                  <span className="event-category career">
                    CAREER
                  </span>

                  <h3>Career & Internship Fair</h3>

                  <div className="event-information">

                    <span>
                      <MapPin size={14} />
                      University Main Hall
                    </span>

                    <span>
                      <Clock size={14} />
                      9:00 AM - 3:00 PM
                    </span>

                    <span>
                      <Users size={14} />
                      250 Participants
                    </span>

                  </div>

                </div>

                <button className="details-button">
                  Details
                </button>

              </div>

            </section>

            {/* Right Column */}
            <aside className="right-dashboard">

              {/* Calendar */}
              <div className="calendar-card">

                <div className="calendar-header">

                  <h2>My Calendar</h2>

                  <div>October 2026</div>

                </div>

                <div className="calendar-week">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                <div className="calendar-days">

                  <span className="muted">27</span>
                  <span className="muted">28</span>
                  <span className="muted">29</span>
                  <span className="muted">30</span>

                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>

                  <span className="selected-day">5</span>
                  <span>6</span>
                  <span>7</span>
                  <span className="event-day">8</span>
                  <span>9</span>
                  <span>10</span>

                  <span>11</span>
                  <span className="event-day">12</span>
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

              {/* Announcements */}
              <div className="announcements-card">

                <div className="announcement-title">

                  <h2>Recent Announcements</h2>

                  <button>View All</button>

                </div>

                <div className="announcement">

                  <div className="announcement-icon">
                    <Bell size={16} />
                  </div>

                  <div>
                    <strong>New events added</strong>

                    <p>
                      5 new university events are available.
                    </p>

                    <small>2 hours ago</small>
                  </div>

                </div>

                <div className="announcement">

                  <div className="announcement-icon">
                    <Bell size={16} />
                  </div>

                  <div>
                    <strong>Registration reminder</strong>

                    <p>
                      Don't forget to register for upcoming events.
                    </p>

                    <small>Yesterday</small>
                  </div>

                </div>

              </div>

            </aside>

          </div>

        </div>

      </main>

    </div>
  );
}

export default StudentDashboard;