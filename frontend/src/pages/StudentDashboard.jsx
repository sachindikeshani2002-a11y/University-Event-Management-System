import {
  Home,
  CalendarDays,
  ClipboardList,
  Heart,
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

      {/* ================= SIDEBAR ================= */}

      <aside className="dashboard-sidebar">

        <div className="sidebar-brand">

          <div className="brand-icon">
            🎓
          </div>

          <div>
            <h2>University Event</h2>
            <p>Management System</p>
          </div>

        </div>


        {/* Navigation */}

        <nav className="sidebar-navigation">

          <a className="sidebar-link active">
            <Home size={20} />
            <span>Dashboard</span>
          </a>

          <a className="sidebar-link">
            <CalendarDays size={20} />
            <span>Events</span>
          </a>

          <a className="sidebar-link">
            <ClipboardList size={20} />
            <span>My Registrations</span>
          </a>

          <a className="sidebar-link">
            <Heart size={20} />
            <span>Saved Events</span>
          </a>

          <a className="sidebar-link">
            <CalendarDays size={20} />
            <span>Calendar</span>
          </a>

          <a className="sidebar-link">
            <User size={20} />
            <span>Profile</span>
          </a>

          <a className="sidebar-link">
            <Bell size={20} />
            <span>Notifications</span>
          </a>

        </nav>


        <div className="sidebar-bottom">

          <a className="sidebar-link">
            <LogOut size={20} />
            <span>Logout</span>
          </a>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="dashboard-main">

        {/* TOP BAR */}

        <header className="dashboard-topbar">

          <div className="search-container">

            <Search size={19} />

            <input
              type="text"
              placeholder="Search events, categories, or locations..."
            />

          </div>


          <div className="topbar-right">

            <button className="notification-button">

              <Bell size={21} />

              <span className="notification-badge">
                3
              </span>

            </button>


            <div className="student-profile">

              <div className="student-avatar">
                A
              </div>

              <div className="student-info">

                <strong>Asha Perera</strong>

                <span>Student</span>

              </div>

            </div>

          </div>

        </header>


        {/* ================= PAGE CONTENT ================= */}

        <section className="dashboard-content">


          {/* WELCOME */}

          <div className="welcome-area">

            <div>

              <h1>
                Welcome back, Asha! 👋
              </h1>

              <p>
                Discover exciting events, participate in activities
                and grow your skills.
              </p>

            </div>

          </div>


          {/* ================= STAT CARDS ================= */}

          <div className="statistics-grid">


            {/* Total Events */}

            <div className="stat-card blue-card">

              <div className="stat-icon">
                <CalendarDays size={24} />
              </div>

              <div>

                <span>Total Events</span>

                <h2>24</h2>

                <small>
                  ↑ 12% from last month
                </small>

              </div>

            </div>


            {/* Registered */}

            <div className="stat-card green-card">

              <div className="stat-icon">
                <ClipboardList size={24} />
              </div>

              <div>

                <span>Registered Events</span>

                <h2>8</h2>

                <small>
                  ↑ 2 new this month
                </small>

              </div>

            </div>


            {/* Saved */}

            <div className="stat-card purple-card">

              <div className="stat-icon">
                <Heart size={24} />
              </div>

              <div>

                <span>Saved Events</span>

                <h2>6</h2>

                <small>
                  ↑ 3 new this month
                </small>

              </div>

            </div>


            {/* Upcoming */}

            <div className="stat-card orange-card">

              <div className="stat-icon">
                <Clock size={24} />
              </div>

              <div>

                <span>Upcoming Events</span>

                <h2>3</h2>

                <small>
                  Next 7 days
                </small>

              </div>

            </div>

          </div>


          {/* ================= TWO COLUMN AREA ================= */}

          <div className="dashboard-grid">


            {/* LEFT - EVENTS */}

            <div className="events-section">

              <div className="section-title">

                <div>

                  <h2>Upcoming Events</h2>

                  <p>
                    Don't miss what's happening on campus
                  </p>

                </div>

                <button>
                  View all
                  <ChevronRight size={17} />
                </button>

              </div>


              {/* EVENT 1 */}

              <div className="event-card">

                <div className="event-date">

                  <strong>05</strong>

                  <span>OCT</span>

                </div>


                <div className="event-content">

                  <span className="event-category technology">
                    Technology
                  </span>

                  <h3>
                    University Tech Conference 2026
                  </h3>

                  <div className="event-information">

                    <span>
                      <MapPin size={15} />
                      Main Auditorium
                    </span>

                    <span>
                      <Clock size={15} />
                      9:00 AM - 4:00 PM
                    </span>

                    <span>
                      <Users size={15} />
                      120 Participants
                    </span>

                  </div>

                </div>


                <button className="details-button">
                  View Details
                  <ChevronRight size={16} />
                </button>

              </div>


              {/* EVENT 2 */}

              <div className="event-card">

                <div className="event-date">

                  <strong>08</strong>

                  <span>OCT</span>

                </div>


                <div className="event-content">

                  <span className="event-category workshop">
                    Workshop
                  </span>

                  <h3>
                    Introduction to Artificial Intelligence
                  </h3>

                  <div className="event-information">

                    <span>
                      <MapPin size={15} />
                      Computer Engineering Faculty
                    </span>

                    <span>
                      <Clock size={15} />
                      10:00 AM - 1:00 PM
                    </span>

                    <span>
                      <Users size={15} />
                      60 Participants
                    </span>

                  </div>

                </div>


                <button className="details-button">
                  View Details
                  <ChevronRight size={16} />
                </button>

              </div>


              {/* EVENT 3 */}

              <div className="event-card">

                <div className="event-date">

                  <strong>12</strong>

                  <span>OCT</span>

                </div>


                <div className="event-content">

                  <span className="event-category career">
                    Career
                  </span>

                  <h3>
                    Career & Internship Fair
                  </h3>

                  <div className="event-information">

                    <span>
                      <MapPin size={15} />
                      University Grounds
                    </span>

                    <span>
                      <Clock size={15} />
                      8:30 AM - 5:00 PM
                    </span>

                    <span>
                      <Users size={15} />
                      300 Participants
                    </span>

                  </div>

                </div>


                <button className="details-button">
                  View Details
                  <ChevronRight size={16} />
                </button>

              </div>

            </div>


            {/* ================= RIGHT SIDE ================= */}

            <div className="right-dashboard">


              {/* EVENT CALENDAR */}

              <div className="calendar-card">

                <div className="calendar-header">

                  <h2>My Calendar</h2>

                  <div>
                    October 2026
                  </div>

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


              {/* ANNOUNCEMENTS */}

              <div className="announcements-card">

                <div className="announcement-title">

                  <h2>Recent Announcements</h2>

                  <button>
                    View all
                  </button>

                </div>


                <div className="announcement">

                  <div className="announcement-icon">
                    <Bell size={17} />
                  </div>

                  <div>

                    <strong>
                      Tech Conference Registration Open
                    </strong>

                    <p>
                      Join us for the biggest tech event this year!
                    </p>

                    <small>
                      2 Oct 2026
                    </small>

                  </div>

                </div>


                <div className="announcement">

                  <div className="announcement-icon">
                    <CalendarDays size={17} />
                  </div>

                  <div>

                    <strong>
                      Workshop Schedule Released
                    </strong>

                    <p>
                      Check the full schedule for AI workshops.
                    </p>

                    <small>
                      30 Sep 2026
                    </small>

                  </div>

                </div>


                <div className="announcement">

                  <div className="announcement-icon">
                    <CalendarDays size={17} />
                  </div>

                  <div>

                    <strong>
                      New Events Added
                    </strong>

                    <p>
                      Discover the latest events on campus.
                    </p>

                    <small>
                      28 Sep 2026
                    </small>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default StudentDashboard;