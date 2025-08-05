import React from "react";
import { Link } from "react-router-dom";

/**
 * A reusable card component to display course information.
 *
 * @param {object} props
 * @param {object} props.course - The course object to display.
 * @param {string} props.course._id - The unique ID of the course.
 * @param {string} props.course.title - The title of the course.
 * @param {string} [props.course.imageUrl] - The URL for the course's cover image.
 * @param {object} [props.course.instructor] - The instructor object (should be populated).
 * @param {string} [props.course.instructor.name] - The name of the instructor.
 */
const CourseCard = ({ course }) => {
  // If a course image isn't provided, generate a dynamic placeholder.
  const imageUrl =
    course.imageUrl ||
    `https://placehold.co/600x400/6366f1/ffffff?text=${encodeURIComponent(
      course.title
    )}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out flex flex-col">
      <Link to={`/courses/${course._id}`} className="block">
        <img
          className="w-full h-48 object-cover"
          src={imageUrl}
          alt={`Cover image for ${course.title}`}
        />
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight h-16">
          {course.title}
        </h3>

        <p className="text-sm text-gray-500 mb-4">
          By {course.instructor?.name || "EduHub Instructor"}
        </p>


        <div className="mt-auto flex justify-between items-center">
          <p className="text-lg font-semibold text-indigo-600">
            Free 
          </p>
          <Link
            to={`/courses/${course._id}`}
            className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
