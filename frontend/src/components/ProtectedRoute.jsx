import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  if (adminOnly && user.role !== "admin") {
    return <div className="text-center mt-10 text-red-600">Access Denied</div>;
  }

  return children;
};

export default ProtectedRoute;