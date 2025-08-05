import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * A wrapper for routes that require authentication and, optionally, specific user roles.
 *
 * @param {object} props
 * @param {string[]} [props.allowedRoles] - An array of roles allowed to access this route.
 * If not provided, any authenticated user will be allowed.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Handle the authentication loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-600 mx-auto"></div>
          <h2 className="text-2xl font-semibold text-gray-700 mt-4">
            Loading...
          </h2>
          <p className="text-gray-500">Verifying your credentials</p>
        </div>
      </div>
    );
  }

  // 2. Handle the case where the user is not authenticated
  // We redirect to the login page, but also pass the current location in the state.
  // This allows us to redirect the user back to the page they were trying to access after they log in.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Handle role-based authorization
  // If allowedRoles are specified and the user's role is not in the array,
  // redirect them to an "unauthorized" page.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. If all checks pass, render the nested child route
  // The <Outlet /> component from react-router-dom renders the next matched route in the hierarchy.
  return <Outlet />;
};

export default ProtectedRoute;
