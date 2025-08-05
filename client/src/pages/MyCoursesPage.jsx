import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getMyCourses, reset } from "../features/courses/courseSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

function MyCoursesPage() {
  const dispatch = useDispatch();
  const { courses, isLoading, isError, message } = useSelector(
    (state) => state.courses
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(getMyCourses());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Courses</h1>
        {/* This is the button that was missing */}
        <Link
          to="/create-course"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          + Create New Course
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course._id} className="border rounded-lg p-4 shadow-sm">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <h2 className="text-xl font-bold">{course.title}</h2>
              <p className="text-gray-600 my-2">${course.price}</p>
              <Link
                to={`/edit-course/${course._id}`}
                className="w-full inline-block text-center bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
              >
                Edit Course
              </Link>
            </div>
          ))
        ) : (
          <h3>You have not created any courses yet.</h3>
        )}
      </div>
    </div>
  );
}

export default MyCoursesPage;
