import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center text-center px-4">
      <div className="bg-white p-12 rounded-lg shadow-xl">
        <h1 className="text-6xl font-extrabold text-indigo-600">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-800">
          Page Not Found
        </h2>
        <p className="mt-4 text-gray-600">
          Sorry, the page you are looking for does not exist.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="bg-indigo-600 text-white hover:bg-indigo-700 font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
