import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateCourse,
  getCourseById,
  reset,
} from "../features/courses/courseSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

function EditCoursePage() {
  const { id: courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedCourse, isLoading, isError, isSuccess, message } =
    useSelector((state) => state.courses);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const { title, description, price } = formData;

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success("Course updated successfully!");
      navigate("/dashboard");
    }

    // On page load, fetch the course details to pre-fill the form
    dispatch(getCourseById(courseId));

    return () => {
      dispatch(reset());
    };
  }, [courseId, dispatch, isError, isSuccess, message, navigate]);

  // When the course data is loaded, update the form state
  useEffect(() => {
    if (selectedCourse) {
      setFormData({
        title: selectedCourse.title,
        description: selectedCourse.description,
        price: selectedCourse.price,
      });
    }
  }, [selectedCourse]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onFileChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const courseData = new FormData();
    courseData.append("title", title);
    courseData.append("description", description);
    courseData.append("price", price);
    if (thumbnail) {
      courseData.append("thumbnail", thumbnail);
    }

    dispatch(updateCourse({ courseId, courseData }));
  };

  if (isLoading || !selectedCourse) {
    return <Spinner />;
  }

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold text-center">Edit Course</h1>
        <input
          type="text"
          name="title"
          value={title}
          onChange={onChange}
          placeholder="Course Title"
          required
          className="w-full px-4 py-2 border rounded-md"
        />
        <textarea
          name="description"
          value={description}
          onChange={onChange}
          placeholder="Course Description"
          required
          className="w-full px-4 py-2 border rounded-md"
        ></textarea>
        <input
          type="number"
          name="price"
          value={price}
          onChange={onChange}
          placeholder="Price"
          required
          className="w-full px-4 py-2 border rounded-md"
        />
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Upload New Thumbnail (Optional)
          </label>
          <input
            type="file"
            name="thumbnail"
            onChange={onFileChange}
            className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded-md"
        >
          Update Course
        </button>
      </form>
    </div>
  );
}

export default EditCoursePage;
