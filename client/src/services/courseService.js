import axios from "axios";

// NOTE: Your deployed backend URL should be in /client/.env
const API_URL = process.env.REACT_APP_API_URL + "/api/courses";

const createCourse = async (courseData, token) => {
  // We need a token for protected routes
  const user = JSON.parse(localStorage.getItem('user'));
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`, // This is a placeholder; real auth is cookie-based
      "Content-Type": "multipart/form-data",
    },
  };
  const response = await axios.post(API_URL, courseData, config);
  return response.data;
};

const getCourses = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const courseService = { createCourse, getCourses };
export default courseService;
