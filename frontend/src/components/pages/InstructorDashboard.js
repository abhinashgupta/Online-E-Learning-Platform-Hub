import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

// --- Reusable Stat Card Component ---
const StatCard = ({ icon, title, value, colorClass }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
    <div className={`mr-4 p-3 rounded-full ${colorClass}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// --- Main Instructor Dashboard Component ---
const InstructorDashboard = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // State for the new course form
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/courses/mycourses");
        setMyCourses(data);
      } catch (err) {
        setError("Could not fetch your courses. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorCourses();
  }, []);

  // Memoized calculation for total students
  const totalStudents = useMemo(() => {
    return myCourses.reduce(
      (acc, course) => acc + course.enrolledStudents.length,
      0
    );
  }, [myCourses]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourseTitle || !newCourseDescription) {
      alert("Please fill in both title and description.");
      return;
    }
    setIsSubmitting(true);
    try {
      const courseData = {
        title: newCourseTitle,
        description: newCourseDescription,
      };
      const { data } = await api.post("/courses", courseData);
      setMyCourses((prevCourses) => [...prevCourses, data]); // Add new course to the list
      setNewCourseTitle("");
      setNewCourseDescription("");
      alert("Course created successfully!");
    } catch (err) {
      alert("Failed to create course.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="text-center p-8 text-lg">Loading your dashboard...</div>
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
          <h1 className="text-3xl font-bold text-gray-900">
            Instructor Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.name}! Let's create something new today.
          </p>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            icon={<BookOpenIcon />}
            title="Courses Created"
            value={myCourses.length}
            colorClass="bg-blue-100 text-blue-600"
          />
          <StatCard
            icon={<UserGroupIcon />}
            title="Total Students"
            value={totalStudents}
            colorClass="bg-green-100 text-green-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content: Course List */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                My Courses
              </h2>
              <div className="space-y-4">
                {myCourses.length > 0 ? (
                  myCourses.map((course) => (
                    <div
                      key={course._id}
                      className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h3 className="font-bold text-lg text-indigo-700">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {course.enrolledStudents.length} student(s) enrolled
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        
                        <Link
                          to={`/instructor/course/${course._id}/edit`}
                          className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Manage Course
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-gray-500">
                      You haven't created any courses yet.
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Use the form to create your first one!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: Create New Course Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Create a New Course
              </h2>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <label
                    htmlFor="courseTitle"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Course Title
                  </label>
                  <input
                    type="text"
                    id="courseTitle"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Ultimate JavaScript Course"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="courseDescription"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Course Description
                  </label>
                  <textarea
                    id="courseDescription"
                    value={newCourseDescription}
                    onChange={(e) => setNewCourseDescription(e.target.value)}
                    rows="4"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="A brief summary of what students will learn..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md font-medium disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Course"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- SVG Icons ---
const BookOpenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);
const UserGroupIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

export default InstructorDashboard;
