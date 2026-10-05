import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentDashboard from "./pages/StudentDashboard";
import Events from "./pages/Events";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentDashboard />} />
        <Route path="/events" element={<Events />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;