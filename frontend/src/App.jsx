import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StudentProvider } from "./context/StudentContext";
import StudentDashboard from "./pages/StudentDashboard";
import Events from "./pages/Events";
import MyRegistrations from "./pages/MyRegistrations";
import SavedEvents from "./pages/SavedEvents";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Calendar from "./pages/Calendar";
import { OrganizerProvider } from "./context/OrganizerContext";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import OrganizerEvents from "./pages/OrganizerEvents";
import CreateEvent from "./pages/CreateEvent";
import OrganizerEventDetails from "./pages/OrganizerEventDetails";
import OrganizerRegistrations from "./pages/OrganizerRegistrations";
import OrganizerAnalytics from "./pages/OrganizerAnalytics";
import OrganizerAnnouncements from "./pages/OrganizerAnnouncements";
import OrganizerNotifications from "./pages/OrganizerNotifications";
import OrganizerProfile from "./pages/OrganizerProfile";

function App() {
  return (
    <StudentProvider>
      <BrowserRouter>
        <OrganizerProvider>
          <Routes>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/registrations" element={<MyRegistrations />} />
            <Route path="/saved-events" element={<SavedEvents />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/calendar" element={<Calendar />} />

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
          </Routes>
        </OrganizerProvider>
      </BrowserRouter>
    </StudentProvider>
  );
}

export default App;