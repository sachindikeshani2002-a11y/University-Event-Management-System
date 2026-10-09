import { BrowserRouter, Route, Routes } from "react-router-dom";
import { StudentProvider } from "./context/StudentContext";
import { OrganizerProvider } from "./context/OrganizerContext";
import { AdminProvider } from "./context/AdminContext";
import { AuthProvider } from "./context/AuthContext";
import { RequireGuest, RequireRole } from "./components/RouteGuards";
import StudentDashboard from "./pages/StudentDashboard";
import Events from "./pages/Events";
import MyRegistrations from "./pages/MyRegistrations";
import SavedEvents from "./pages/SavedEvents";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Calendar from "./pages/Calendar";
import Login from "./pages/Login";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import OrganizerEvents from "./pages/OrganizerEvents";
import CreateEvent from "./pages/CreateEvent";
import OrganizerEventDetails from "./pages/OrganizerEventDetails";
import OrganizerRegistrations from "./pages/OrganizerRegistrations";
import OrganizerAnalytics from "./pages/OrganizerAnalytics";
import OrganizerAnnouncements from "./pages/OrganizerAnnouncements";
import OrganizerNotifications from "./pages/OrganizerNotifications";
import OrganizerProfile from "./pages/OrganizerProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminStudents from "./pages/AdminStudents";
import AdminOrganizers from "./pages/AdminOrganizers";
import AdminEvents from "./pages/AdminEvents";
import AdminEventApprovals from "./pages/AdminEventApprovals";
import AdminEventDetails from "./pages/AdminEventDetails";
import AdminRegistrations from "./pages/AdminRegistrations";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminAnnouncements from "./pages/AdminAnnouncements";
import AdminNotifications from "./pages/AdminNotifications";
import AdminActivityLogs from "./pages/AdminActivityLogs";
import AdminProfile from "./pages/AdminProfile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <StudentProvider>
        <OrganizerProvider>
          <AdminProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<RequireGuest><Login /></RequireGuest>} />

                <Route element={<RequireRole role="student" />}>
                  <Route path="/" element={<StudentDashboard />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/registrations" element={<MyRegistrations />} />
                  <Route path="/saved-events" element={<SavedEvents />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/notifications" element={<Notifications />} />
                </Route>

                <Route element={<RequireRole role="organizer" />}>
                  <Route path="/organizer" element={<OrganizerDashboard />} />
                  <Route path="/organizer/events" element={<OrganizerEvents />} />
                  <Route path="/organizer/events/create" element={<CreateEvent />} />
                  <Route path="/organizer/events/edit/:id" element={<CreateEvent />} />
                  <Route path="/organizer/events/:id" element={<OrganizerEventDetails />} />
                  <Route path="/organizer/registrations" element={<OrganizerRegistrations />} />
                  <Route path="/organizer/analytics" element={<OrganizerAnalytics />} />
                  <Route path="/organizer/announcements" element={<OrganizerAnnouncements />} />
                  <Route path="/organizer/notifications" element={<OrganizerNotifications />} />
                  <Route path="/organizer/profile" element={<OrganizerProfile />} />
                </Route>

                <Route element={<RequireRole role="admin" />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/students" element={<AdminStudents />} />
                  <Route path="/admin/organizers" element={<AdminOrganizers />} />
                  <Route path="/admin/events" element={<AdminEvents />} />
                  <Route path="/admin/events/:id" element={<AdminEventDetails />} />
                  <Route path="/admin/event-approvals" element={<AdminEventApprovals />} />
                  <Route path="/admin/registrations" element={<AdminRegistrations />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                  <Route path="/admin/announcements" element={<AdminAnnouncements />} />
                  <Route path="/admin/notifications" element={<AdminNotifications />} />
                  <Route path="/admin/activity" element={<AdminActivityLogs />} />
                  <Route path="/admin/profile" element={<AdminProfile />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AdminProvider>
        </OrganizerProvider>
      </StudentProvider>
    </AuthProvider>
  );
}

export default App;