const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");

const {
  getCourses,
  getCourseById,
  createCourse,
  enrollInCourse,
} = require("../controllers/courseController.js");

const { protect, authorize } = require("../middleware/authMiddleware.js");
const upload = require("../middleware/uploadMiddleware.js");
const { validate } = require("../middleware/validationMiddleware.js");

// @route   GET /api/courses
router.get("/", getCourses);

// @route   POST /api/courses
router.post(
  "/",
  protect,
  authorize("instructor", "admin"),
  upload.single("thumbnail"),
  [
    body("title", "Title is required").not().isEmpty(),
    body("description", "Description is required").not().isEmpty(),
    body("price", "Price must be a valid number").isNumeric(),
  ],
  validate,
  createCourse
);

// @route   GET /api/courses/:id
router.get(
  "/:id",
  [param("id", "Invalid Course ID format").isMongoId()],
  validate,
  getCourseById
);

// @route   POST /api/courses/:id/enroll
router.post(
  "/:id/enroll",
  protect,
  authorize("student"),
  [param("id", "Invalid Course ID format").isMongoId()],
  validate,
  enrollInCourse
);

module.exports = router;
