import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/api/courses";

// The function now accepts the token as an argument
const createCourse = async (courseData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
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


// Update a course
const updateCourse = async (courseId, courseData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await axios.put(API_URL + courseId, courseData, config);
  return response.data;
};


// Get instructor's own courses
const getMyCourses = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + '/mycourses', config);
  return response.data;
};

const courseService = { createCourse, getCourses, updateCourse, getMyCourses };
export default courseService;
