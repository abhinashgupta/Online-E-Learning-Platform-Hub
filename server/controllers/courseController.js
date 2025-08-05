const Course = require("../models/Course.js");
const Enrollment = require("../models/Enrollment.js");

const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({}).populate("instructor", "name");
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

const getCourseById = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  // This function is already correctly wrapped, no changes needed here.
  try {
    const { title, description, price } = req.body;
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
      thumbnail: thumbnailUrl,
    });
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    next(error);
  }
};


// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Check if the logged-in user is the instructor who created the course
    if (course.instructor.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to update this course');
    }

    // Update the fields
    course.title = req.body.title || course.title;
    course.description = req.body.description || course.description;
    course.price = req.body.price || course.price;

    // Handle new thumbnail upload if provided
    if (req.file) {
      course.thumbnail = req.file.path;
    }

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
};


// @desc    Get logged in instructor's courses
// @route   GET /api/courses/mycourses
// @access  Private/Instructor
const getMyCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    res.json(courses);
  } catch (error) {
    next(error);
  }
};



const enrollInCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

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
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  enrollInCourse,
  getMyCourses,
};
