import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ roles = [] }) => {
  const { user, booting } = useAuth();
  const location = useLocation();

  if (booting) return <div className="section">Loading your workspace...</div>;

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  if (roles.length && !roles.includes(user.role)) {
    const target = user.role === "teacher" ? "/teacher" : user.role === "admin" ? "/admin" : "/student";
    return <Navigate to={target} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
