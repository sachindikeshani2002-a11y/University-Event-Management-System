import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StudentProvider } from "./context/StudentContext";
import StudentDashboard from "./pages/StudentDashboard";
import Events from "./pages/Events";
import MyRegistrations from "./pages/MyRegistrations";
import SavedEvents from "./pages/SavedEvents";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Calendar from "./pages/Calendar";

function App() {
  return (
    <StudentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/registrations" element={<MyRegistrations />} />
          <Route path="/saved-events" element={<SavedEvents />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </BrowserRouter>
    </StudentProvider>
  );
}

export default App;