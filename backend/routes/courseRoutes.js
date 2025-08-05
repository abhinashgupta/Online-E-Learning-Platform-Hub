const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  addLessonToCourse,
  updateLessonInCourse,
  deleteLessonFromCourse,
  getMyCreatedCourses,
  getMyEnrolledCourses,
} = require("../controllers/courseController");
const {
  protect,
  instructor,
  instructorOrAdmin,
} = require("../middleware/authMiddleware");


const {
  courseValidator,
  lessonValidator,
  validate,
} = require("../validators/authValidator");


router
  .route("/")
  .get(getCourses)
  .post(protect, instructorOrAdmin, courseValidator(), validate, createCourse);


router.route("/mycourses").get(protect, instructor, getMyCreatedCourses);
router.route("/myenrollments").get(protect, getMyEnrolledCourses);


router
  .route("/:id")
  .get(getCourseById)
  .put(protect, instructorOrAdmin, courseValidator(), validate, updateCourse)
  .delete(protect, instructorOrAdmin, deleteCourse);


router.route("/:id/enroll").post(protect, enrollInCourse);


router
  .route("/:id/lessons")
  .post(
    protect,
    instructorOrAdmin,
    lessonValidator(),
    validate,
    addLessonToCourse
  );


router
  .route("/:id/lessons/:lessonId")
  .put(
    protect,
    instructorOrAdmin,
    lessonValidator(),
    validate,
    updateLessonInCourse
  )
  .delete(protect, instructorOrAdmin, deleteLessonFromCourse);

module.exports = router;
