import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  getCourseById,
  enrollInCourse,
  reset,
} from "../features/courses/courseSlice";
import Spinner from "../components/Spinner";

function CourseDetailPage() {
  const { id: courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { selectedCourse, isLoading, isError, message } = useSelector(
    (state) => state.courses
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(getCourseById(courseId));

    return () => {
      dispatch(reset());
    };
  }, [courseId, dispatch, isError, message]);

  const onEnroll = () => {
    if (!user) {
      toast.error("You must be logged in to enroll.");
      navigate("/login");
      return;
    }
    dispatch(enrollInCourse(courseId));
  };

  if (isLoading || !selectedCourse) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={selectedCourse.thumbnail}
            alt={selectedCourse.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">{selectedCourse.title}</h1>
          <p className="text-gray-600 mb-4">
            Created by{" "}
            <span className="font-semibold">
              {selectedCourse.instructor?.name}
            </span>
          </p>
          <p className="text-lg text-gray-700 mb-6">
            {selectedCourse.description}
          </p>
          <div className="text-3xl font-bold text-blue-600 mb-6">
            Price: ${selectedCourse.price}
          </div>

          {user && user.role === "student" && (
            <button
              onClick={onEnroll}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Enroll Now
            </button>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Course Content</h2>
        <ul className="space-y-3">
          {selectedCourse.lessons?.length > 0 ? (
            selectedCourse.lessons.map((lesson, index) => (
              <li
                key={index}
                className="bg-gray-100 p-4 rounded-md flex items-center"
              >
                <span className="text-blue-500 font-bold mr-4">
                  {index + 1}
                </span>
                <p>{lesson.title}</p>
              </li>
            ))
          ) : (
            <p>No lessons have been added to this course yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default CourseDetailPage;
