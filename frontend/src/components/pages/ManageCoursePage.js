import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const ManageCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  // State for the main course edit form
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal and Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);
        setLessons(data.lessons || []);
        setCourseTitle(data.title); 
        setCourseDescription(data.description); 
      } catch (err) {
        setError("Failed to fetch course data.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const handleUpdateCourseDetails = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/courses/${id}`, {
        title: courseTitle,
        description: courseDescription,
      });
      alert("Course details updated successfully!");
    } catch (err) {
      alert("Failed to update course details.");
    }
  };

  const handleVideoUpload = async () => {
    
    if (!videoFile) return null;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/video/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setIsUploading(false);
      return data.secure_url;
    } catch (err) {
      setIsUploading(false);
      alert("Video upload failed.");
      return null;
    }
  };

  const openModal = (mode, lesson = null) => {
    setModalMode(mode);
    if (mode === "edit" && lesson) {
      setCurrentLesson(lesson);
      setLessonTitle(lesson.title);
      setLessonContent(lesson.content || "");
      setVideoUrl(lesson.videoUrl || "");
    } else {
      setCurrentLesson(null);
      setLessonTitle("");
      setLessonContent("");
      setVideoUrl("");
    }
    setVideoFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();


    let finalVideoUrl = currentLesson ? currentLesson.videoUrl : "";

    if (videoFile) {
      const uploadedUrl = await handleVideoUpload();
      if (!uploadedUrl) return;
      finalVideoUrl = uploadedUrl;
    }

    const lessonData = {
      title: lessonTitle,
      content: lessonContent,
      videoUrl: finalVideoUrl,
    };

    try {
      if (modalMode === "add") {
        const { data: newLesson } = await api.post(
          `/courses/${id}/lessons`,
          lessonData
        );
        setLessons([...lessons, newLesson]);
      } else if (modalMode === "edit" && currentLesson) {
        const { data: updatedLesson } = await api.put(
          `/courses/${id}/lessons/${currentLesson._id}`,
          lessonData
        );
        setLessons(
          lessons.map((l) => (l._id === currentLesson._id ? updatedLesson : l))
        );
      }
      closeModal();
    } catch (err) {
      alert(`Failed to ${modalMode} lesson.`);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        await api.delete(`/courses/${id}/lessons/${lessonId}`);
        setLessons(lessons.filter((l) => l._id !== lessonId));
      } catch (err) {
        alert("Failed to delete lesson.");
      }
    }
  };

  if (loading)
    return <div className="text-center p-8">Loading Course Manager...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-4xl mx-auto py-8 px-4">
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 hover:text-indigo-800 mb-4"
        >
          &larr; Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Manage: {course?.title}
        </h1>

       
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Course Details
          </h2>
          <form onSubmit={handleUpdateCourseDetails} className="space-y-4">
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
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                rows="4"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md font-medium"
            >
              Save Changes
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Lessons ({lessons.length})
            </h2>
            <button
              onClick={() => openModal("add")}
              className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md font-medium"
            >
              Add Lesson
            </button>
          </div>
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <div key={lesson._id} className="p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {lesson.title}
                  </h3>
                  <div className="space-x-4">
                    <button
                      onClick={() => openModal("edit", lesson)}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson._id)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {lesson.content && (
                  <p className="text-gray-600 mt-2">{lesson.content}</p>
                )}
                {lesson.videoUrl && (
                  <div className="mt-4">
                    <video key={lesson.videoUrl} width="100%" controls>
                      <source src={lesson.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
            ))}
            {lessons.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No lessons added yet.
              </p>
            )}
          </div>
        </div>
      </main>

      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6">
              {modalMode === "add" ? "Add a New Lesson" : "Edit Lesson"}
            </h2>
            <form onSubmit={handleLessonSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="lessonTitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Lesson Title
                </label>
                <input
                  type="text"
                  id="lessonTitle"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lessonContent"
                  className="block text-sm font-medium text-gray-700"
                >
                  Lesson Content
                </label>
                <textarea
                  id="lessonContent"
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  rows="4"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="videoFile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Video
                </label>
                <input
                  type="file"
                  id="videoFile"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {videoUrl && !videoFile && (
                  <p className="text-xs text-gray-500 mt-1">
                    Current video is set. Upload a new file to replace it.
                  </p>
                )}
              </div>
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md disabled:bg-indigo-400"
                >
                  {isUploading ? "Uploading Video..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoursePage;
