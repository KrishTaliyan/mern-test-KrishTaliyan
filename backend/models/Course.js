const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: String,
  courseDescription: String,
  instructor: String
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);