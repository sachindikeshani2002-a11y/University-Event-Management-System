import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const dashboardByRole = {
  student: "/",
  organizer: "/organizer",
  admin: "/admin",
};

export function RequireRole({ role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={dashboardByRole[user.role]} replace />;

  return <Outlet />;
}

export function RequireGuest({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to={dashboardByRole[user.role]} replace />;
  return children;
}
