import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";
import Loader from "../components/common/Loader";

const ProtectedRoute = ({ children }) => {
  const auth = useAdminAuth();

  // Safety check (prevents silent crashes)
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  const { admin, loading } = auth;

  // Show loader while checking auth state
  if (loading) {
    return <Loader />;
  }

  // Redirect if not logged in
  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  // Authorized → render page
  return children;
};

export default ProtectedRoute;
