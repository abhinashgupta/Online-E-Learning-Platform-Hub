import axios from "axios";

// Create an instance of axios with a custom configuration.
const api = axios.create({
  // Use the environment variable for the base URL, with a fallback for development.
  // This makes it easy to switch between development, staging, and production APIs.
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * AXIOS INTERCEPTORS
 * Interceptors allow us to run code or modify requests and responses globally
 * before they are handled by `then` or `catch`.
 */

// 1. Request Interceptor
// This runs BEFORE each request is sent.
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage.
    const token = localStorage.getItem("token");

    // If a token exists, add it to the Authorization header.
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // IMPORTANT: Always return the config object, otherwise the request will be blocked.
    return config;
  },
  (error) => {
    // This part handles errors that occur before the request is sent.
    return Promise.reject(error);
  }
);

// 2. Response Interceptor
// This runs on every response that comes back from the API.
api.interceptors.response.use(
  // The first function handles successful responses (2xx status codes).
  // We just pass it through as-is.
  (response) => response,

  // The second function handles error responses.
  (error) => {
    // Check if the error is a 401 Unauthorized response.
    // This typically means the JWT token is expired or invalid.
    if (error.response && error.response.status === 401) {
      // If we get a 401, we want to log the user out to prevent them
      // from staying in a broken, unauthenticated state.

      console.log("Session expired or invalid. Logging out.");

      // Remove the token from localStorage.
      localStorage.removeItem("token");

      // Redirect the user to the login page.
      // Using window.location.href will cause a full page refresh,
      // which helps to clear any old state in the app.
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // For all other errors, we just pass the error along to be handled
    // by the .catch() block where the API call was made.
    return Promise.reject(error);
  }
);

export default api;
