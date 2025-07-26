const mongoose = require("mongoose");

const lessonSchema = mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
});

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    lessons: [lessonSchema],
    thumbnail: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);
module.exports =  Course;
