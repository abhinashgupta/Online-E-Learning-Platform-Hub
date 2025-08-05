import React from "react";
import { Routes, Route } from "react-router-dom";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Page Components
import HomePage from "../src/components/pages/HomePage";
import CoursesPage from "../src/components/pages/CoursesPage";
import CourseDetailPage from "../src/components/pages/CourseDetailPage";
import LoginPage from "../src/components/pages/LoginPage";
import RegisterPage from "../src/components/pages/RegisterPage";
import Dashboard from "../src/components/pages/Dashboard";
import UnauthorizedPage from "../src/components/pages/UnauthorizedPage";
import NotFoundPage from "../src/components/pages/NotFoundPage";
import ManageCoursePage from "../src/components/pages/ManageCoursePage";
import CoursePlayerPage from "../src/components/pages/CoursePlayerPage";

// Route Protection
import ProtectedRoute from "../src/components/private/ProtectedRoute";

function App() {
  return (
   
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      
      <main className="flex-grow">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* --- Protected Routes --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* This route is ONLY for users with the 'admin' role */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<Dashboard />} />
          </Route>

          {/* This route is ONLY for users with the 'instructor' role */}
          <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
            <Route path="/instructor" element={<Dashboard />} />

            {/* --- ADDED THIS ROUTE TO FIX THE 404 ERROR --- */}
            <Route
              path="/instructor/course/:id/edit"
              element={<ManageCoursePage />}
            />
          </Route>

          {/* This route is ONLY for users with the 'student' role */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student-dashboard" element={<Dashboard />} />
            <Route path="/learn/course/:id" element={<CoursePlayerPage />} />
          </Route>

          {/* --- Catch-all 404 Route --- */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
