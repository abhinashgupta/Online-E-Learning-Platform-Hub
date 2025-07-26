const mongoose = require("mongoose");

const enrollmentSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    progress: {
      completedLessons: [{ type: mongoose.Schema.Types.ObjectId }],
      percentage: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a student can only enroll in the same course once
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
module.exports = Enrollment;
