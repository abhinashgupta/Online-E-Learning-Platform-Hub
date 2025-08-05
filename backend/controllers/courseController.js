const asyncHandler = require("express-async-handler");
const Course = require("../models/courseModel");
const Lesson = require("../models/lessonModel"); 
const User = require("../models/userModel");

// @desc    Get all courses (publicly accessible)
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({}).populate("instructor", "name email");
  res.json(courses);
});

// @desc    Get a single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  // We need to populate both 'instructor' and 'lessons' to get their full details
  const course = await Course.findById(req.params.id)
    .populate("instructor", "name email")
    .populate("lessons"); 

  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error("Course not found");
  }
});

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructor or Admin
const createCourse = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const course = new Course({
    title,
    description,
    instructor: req.user._id, 
  });

  const createdCourse = await course.save();
  res.status(201).json(createdCourse);
});

// @desc    Update a course's main details
// @route   PUT /api/courses/:id
// @access  Private/Instructor or Admin
const updateCourse = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  // Check if user is the course instructor or an admin
  if (
    course.instructor.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res
      .status(403)
      .json({ message: "User not authorized to update this course" });
    return;
  }

  course.title = title || course.title;
  course.description = description || course.description;

  const updatedCourse = await course.save();
  res.json(updatedCourse);
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor or Admin
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  if (
    course.instructor.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("User not authorized to delete this course");
  }

  // Also delete all lessons associated with this course to prevent orphaned documents
  await Lesson.deleteMany({ course: course._id });
  await course.deleteOne();

  res.json({ message: "Course and its lessons removed" });
});

// @desc    Enroll the logged-in user in a course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
const enrollInCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  // Prevent instructor from enrolling in their own course
  if (course.instructor.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("Instructors cannot enroll in their own course.");
  }

  // Check if student is already enrolled
  const isAlreadyEnrolled = course.enrolledStudents.find(
    (studentId) => studentId.toString() === req.user._id.toString()
  );

  if (isAlreadyEnrolled) {
    res.status(400);
    throw new Error("Already enrolled in this course");
  }

  course.enrolledStudents.push(req.user._id);
  await course.save();

  res.status(201).json({ message: "Successfully enrolled" });
});

// @desc    Add a lesson to a course
// @route   POST /api/courses/:id/lessons
// @access  Private/Instructor or Admin
const addLessonToCourse = asyncHandler(async (req, res) => {
  const { title, content, videoUrl } = req.body; // <-- Destructure new fields
  const courseId = req.params.id;

  const course = await Course.findById(courseId);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  // Check authorization
  if (
    course.instructor.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("User not authorized to add lessons to this course");
  }

  
  const lesson = await Lesson.create({
    title,
    content, 
    videoUrl,
    course: courseId, 
  });

  
  course.lessons.push(lesson._id);
  await course.save();

 
  res.status(201).json(lesson);
});


// @desc    Update a lesson within a course
// @route   PUT /api/courses/:id/lessons/:lessonId
// @access  Private/Instructor or Admin
const updateLessonInCourse = asyncHandler(async (req, res) => {
  const { title, content, videoUrl } = req.body;
  const { id: courseId, lessonId } = req.params;

  
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  if (
    course.instructor.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res
      .status(403)
      .json({
        message: "User not authorized to update lessons in this course",
      });
    return;
  }

  
  const lesson = await Lesson.findById(lessonId);

  if (!lesson) {
    res.status(404);
    throw new Error("Lesson not found");
  }

  // Update the lesson fields
  lesson.title = title || lesson.title;
  lesson.content = content !== undefined ? content : lesson.content; 
  lesson.videoUrl = videoUrl !== undefined ? videoUrl : lesson.videoUrl; 

  const updatedLesson = await lesson.save();
  res.json(updatedLesson);
});


// @desc    Delete a lesson from a course
// @route   DELETE /api/courses/:id/lessons/:lessonId
// @access  Private/Instructor or Admin
const deleteLessonFromCourse = asyncHandler(async (req, res) => {
  const { id: courseId, lessonId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  // Check authorization
  if (
    course.instructor.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("User not authorized to delete lessons from this course");
  }

 
  const lesson = await Lesson.findByIdAndDelete(lessonId);

  if (!lesson) {
    res.status(404);
    throw new Error("Lesson not found");
  }

  //Remove the lesson's ID from the course's 'lessons' array
  course.lessons.pull(lessonId);
  await course.save();

  res.json({ message: "Lesson removed successfully" });
});

// @desc    Get courses created by the logged-in instructor
// @route   GET /api/courses/mycourses
// @access  Private/Instructor
const getMyCreatedCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id });
  res.json(courses);
});

// @desc    Get courses the logged-in student is enrolled in
// @route   GET /api/courses/myenrollments
// @access  Private/Student
const getMyEnrolledCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({
    enrolledStudents: req.user._id,
  }).populate("instructor", "name");
  res.json(courses);
});

module.exports = {
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
};
