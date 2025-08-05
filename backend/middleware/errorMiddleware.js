/**
 * @desc    Handles requests to routes that do not exist (404 Not Found).
 * This should be placed after all other valid routes in the server file.
 * @param   {object} req - Express request object.
 * @param   {object} res - Express response object.
 * @param   {function} next - Express next middleware function.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the next middleware (our general error handler)
};

/**
 * @desc    A general-purpose Express error handler.
 * This should be the very last piece of middleware in the server file.
 * It catches any errors passed by `next(error)` from anywhere in the app.
 * @param   {object} err - The error object.
 * @param   {object} req - Express request object.
 * @param   {object} res - Express response object.
 * @param   {function} next - Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  // If the status code is 200 (OK), it means the error was thrown without a specific
  // status code being set. In that case, default to 500 (Internal Server Error).
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Optional: Check for specific Mongoose errors like a malformed ObjectID (CastError)
  // This can be useful to give a cleaner "Resource not found" message instead of a generic one.
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  res.status(statusCode).json({
    message: message,
    // Only include the error stack if we are not in production for security reasons
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
