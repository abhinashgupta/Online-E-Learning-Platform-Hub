import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();


  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);

        // After fetching course, check if the current user is enrolled
        if (user && data.enrolledStudents.includes(user._id)) {
          setIsEnrolled(true);
        }
      } catch (error) {
        console.error("Failed to fetch course details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, user]);

  // Function to handle course enrollment ---
  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      await api.post(`/courses/${id}/enroll`);
      setIsEnrolled(true);
      alert("You have successfully enrolled in the course!");
      navigate(`/student-dashboard`); 
    } catch (error) {
      alert("Failed to enroll in the course. You might already be enrolled.");
      console.error("Enrollment error:", error);
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) return <div className="text-center p-10">Loading Course...</div>;
  if (!course) return <div className="text-center p-10">Course not found.</div>;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <span className="text-indigo-600 font-semibold">COURSE</span>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
              {course.title}
            </h1>
            <p className="mt-4 text-lg text-gray-600">{course.description}</p>
            <p className="mt-4 text-sm text-gray-500">
              Instructor: {course.instructor.name}
            </p>
          </div>
          <div className="md:col-span-1">
            <div className="bg-gray-50 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Get Started</h2>
              <p className="text-gray-600 mb-6">
                Get full lifetime access to this course and all its materials.
              </p>

              {/* --- UPDATED ENROLLMENT LOGIC --- */}
              {user ? (
                isEnrolled ? (
                  <Link
                    to={`/student-dashboard`}
                    className="w-full text-center block bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-md font-medium"
                  >
                    You are enrolled
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="w-full text-center block bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3 rounded-md font-medium disabled:bg-indigo-400"
                  >
                    {isEnrolling ? "Enrolling..." : "Enroll Now"}
                  </button>
                )
              ) : (
                <Link
                  to="/login"
                  className="w-full text-center block bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3 rounded-md font-medium"
                >
                  Login to Enroll
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">
            What you'll learn
          </h2>
          <div className="mt-6 space-y-4">
            {course.lessons.map((lesson, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                    {index + 1}
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-gray-800">
                    {lesson.title}
                  </h3>
                </div>

                {/*Display lesson content and video info --- */}
                {lesson.content && (
                  <p className="mt-2 ml-12 text-gray-600">{lesson.content}</p>
                )}
                {lesson.videoUrl && (
                  <div className="mt-2 ml-12 flex items-center text-sm text-gray-500">
                    <svg
                      className="w-5 h-5 mr-2 text-indigo-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Video content available after enrollment.</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
