const Course  = require("../models/Course.js");
const Enrollment = require("../models/Enrollment.js");

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  const courses = await Course.find({}).populate("instructor", "name");
  res.json(courses);
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id).populate(
    "instructor",
    "name email"
  );
  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error("Course not found");
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructor
const createCourse = async (req, res, next) => {
  try {
    const { title, description, price } = req.body;

    // Log the file object to see what Cloudinary is returning
    console.log("Cloudinary file object:", req.file);

    // The secure URL will be available on req.file.path
    // Multer-storage-cloudinary provides this path
    const thumbnailUrl = req.file ? req.file.path : null;

    if (!thumbnailUrl) {
      res.status(400);
      throw new Error("Thumbnail image is required");
    }

    const course = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
      thumbnail: thumbnailUrl, // Save the Cloudinary URL
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    next(error);
  }
};

// @desc    Student enrolls in a course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
const enrollInCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  // Check if already enrolled
  const alreadyEnrolled = await Enrollment.findOne({
    student: req.user._id,
    course: course._id,
  });

  if (alreadyEnrolled) {
    res.status(400);
    throw new Error("You are already enrolled in this course");
  }

  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: course._id,
  });

  res.status(201).json({ message: "Enrolled successfully", enrollment });
};


module.exports = {
    getCourses,
    getCourseById,
    createCourse,
  enrollInCourse
};