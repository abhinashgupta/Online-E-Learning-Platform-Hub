import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCourse, reset } from "../features/courses/courseSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

function CreateCourse() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const { title, description, price } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.courses
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      toast.success("Course Created!");
      navigate("/");
    }
    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

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
    courseData.append("thumbnail", thumbnail);

    dispatch(createCourse(courseData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold text-center">Create a New Course</h1>
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
            Upload Thumbnail
          </label>
          <input
            type="file"
            name="thumbnail"
            onChange={onFileChange}
            required
            className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md"
        >
          Create Course
        </button>
      </form>
    </div>
  );
}

export default CreateCourse;
