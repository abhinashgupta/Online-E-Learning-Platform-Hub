// This middleware will run if no other route is matched
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// This middleware will catch all errors thrown in the application
const errorHandler = (err, req, res, next) => {
  
  console.error("--- An Error Occurred ---");
  console.log("Type of error:", typeof err);
  console.log("Error object:", err);
  console.error("--------------------------");


  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message =
    err && err.message ? err.message : "An internal server error occurred.";

  res.status(statusCode).json({
    message: message,
    // Only show stack trace in development mode
    stack:
      process.env.NODE_ENV === "production" ? "🥞" : err ? err.stack : null,
  });
};

    
module.exports = { notFound, errorHandler };
