import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center text-center px-4">
      <div className="bg-white p-12 rounded-lg shadow-xl">
        <h1 className="text-6xl font-extrabold text-red-600">403</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-800">Access Denied</h2>
        <p className="mt-4 text-gray-600">
          Sorry, you do not have the necessary permissions to access this page.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)} // Go back to the previous page
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Go Back
          </button>
          <Link
            to={user ? "/dashboard" : "/"}
            className="bg-indigo-600 text-white hover:bg-indigo-700 font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
