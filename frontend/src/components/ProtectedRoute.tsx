import { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../auth/AuthProvider";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;
  if (!isLoggedIn) return <Navigate to="/login" />;

  return <>{children}</>;
};

export default ProtectedRoute;
