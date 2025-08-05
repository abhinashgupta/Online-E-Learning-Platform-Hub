import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const CoursePlayerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);
        
        if (data.lessons && data.lessons.length > 0) {
          setSelectedLesson(data.lessons[0]);
        }
      } catch (error) {
        console.error("Failed to fetch course", error);
        alert("You may not be enrolled in this course or it does not exist.");
        navigate("/student-dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  if (loading) {
    return <div className="text-center p-10">Loading Your Course...</div>;
  }

  if (!course) {
    return <div className="text-center p-10">Course not found.</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-100">
      {" "}
    
      {/* Main Content: Video Player */}
      <main className="flex-1 bg-black flex flex-col items-center justify-center p-4">
        {selectedLesson && selectedLesson.videoUrl ? (
          <div className="w-full max-w-4xl">
            <h1 className="text-2xl font-bold text-white mb-4">
              {selectedLesson.title}
            </h1>
            <div className="aspect-w-16 aspect-h-9">
              <video
                key={selectedLesson._id}
                className="w-full h-full"
                controls
                autoPlay
              >
                <source src={selectedLesson.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            {selectedLesson.content && (
              <p className="text-gray-300 mt-4">{selectedLesson.content}</p>
            )}
          </div>
        ) : (
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="mt-4 text-gray-300">
              Select a lesson from the sidebar to begin learning.
            </p>
          </div>
        )}
      </main>
      {/* Sidebar: Lesson List */}
      <aside className="w-80 bg-white shadow-lg overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">{course.title}</h2>
          <p className="text-sm text-gray-500">
            {course.lessons.length} lessons
          </p>
        </div>
        <ul>
          {course.lessons.map((lesson, index) => (
            <li key={lesson._id}>
              <button
                onClick={() => setSelectedLesson(lesson)}
                className={`w-full text-left p-4 border-b hover:bg-gray-100 ${
                  selectedLesson?._id === lesson._id
                    ? "bg-indigo-100 font-semibold"
                    : ""
                }`}
              >
                <div className="flex items-center">
                  <span className="text-gray-500 mr-3">{index + 1}.</span>
                  <span>{lesson.title}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default CoursePlayerPage;
