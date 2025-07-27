import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCourses, reset } from "../features/courses/courseSlice";
import Spinner from "../components/Spinner";

function HomePage() {
  const dispatch = useDispatch();
  const { courses, isLoading, isError, message } = useSelector(
    (state) => state.courses
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    dispatch(getCourses());
    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center my-4">
        Explore Our Courses
      </h1>
      <div className="grid md:grid-cols-3 gap-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course._id} className="border rounded-lg p-4">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <h2 className="text-xl font-bold">{course.title}</h2>
              <p>{course.description}</p>
            </div>
          ))
        ) : (
          <h3>No courses found</h3>
        )}
      </div>
    </div>
  );
}

export default HomePage;
