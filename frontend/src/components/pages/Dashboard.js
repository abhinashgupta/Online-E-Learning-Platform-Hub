import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import AdminDashboard from "./AdminDashboard";
import InstructorDashboard from "./InstructorDashboard";
import StudentDashboard from "./StudentDashboard";

const Dashboard = () => {
  const { user, loading } = useAuth();


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading Dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }


  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "instructor":
      return <InstructorDashboard />;
    case "student":
      return <StudentDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default Dashboard;
