const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  courseCode: { type: String, required: true, unique: true },
  AttendanceList: [{ type: mongoose.Schema.ObjectId, ref: "attendance" }],
});

const Course = mongoose.model('course', CourseSchema, 'course');


module.exports = {
    Course
};
