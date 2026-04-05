import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({
    children,
    allowedRole,
  }: {
    children: any;
    allowedRole?: "company" | "applicant";
  }) => {
    const { user, loading } = useAuth();
  
    console.log("ProtectedRoute → user:", user);
    console.log("ProtectedRoute → loading:", loading);
  
    if (loading) return <div>Loading...</div>;
  
    if (!user) return <Navigate to="/" replace />;
  
    if (allowedRole && user.role !== allowedRole)
      return <Navigate to="/" replace />;
  
    return children;
  };