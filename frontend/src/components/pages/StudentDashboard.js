import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

// --- Reusable Enrolled Course Card Component ---
const EnrolledCourseCard = ({ course }) => {
  // This is a placeholder for progress. In a real app, this would come from the backend.
  const progress = Math.floor(Math.random() * (85 - 20 + 1) + 20); // Random progress between 20-85%
  const imageUrl =
    course.imageUrl ||
    `https://placehold.co/600x400/7c3aed/ffffff?text=${course.title
      .split(" ")
      .join("+")}`;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
      <Link to={`/learn/course/${course._id}`}>
        <img
          className="w-full h-48 object-cover"
          src={imageUrl}
          alt={course.title}
        />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-4">
          By {course.instructor?.name || "EduHub Instructor"}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-indigo-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mb-4">{progress}% Complete</p>

        <div className="mt-auto">
          <Link
            to={`/learn/course/${course._id}`}
            className="block w-full text-center bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md font-medium"
          >
            Continue Learning
          </Link>
        </div>
      </div>
    </div>
  );
};

// --- Main Student Dashboard Component ---
const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/courses/myenrollments");
        setEnrolledCourses(data);
      } catch (err) {
        setError("Could not fetch your enrolled courses. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading)
    return (
      <div className="text-center p-8 text-lg">
        Loading your learning dashboard...
      </div>
    );
  if (error)
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-8"
        role="alert"
      >
        {error}
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.name}! Let's pick up where you left off.
          </p>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Enrolled Courses ({enrolledCourses.length})
          </h2>

          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enrolledCourses.map((course) => (
                <EnrolledCourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No courses yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You are not enrolled in any courses.
              </p>
              <div className="mt-6">
                <Link
                  to="/courses"
                  className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Explore Courses
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
