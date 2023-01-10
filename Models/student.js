const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  usn: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true},
  phone: { type: String, required: true },
  password: { type: String, required: true },
  courses: [{
    type: mongoose.Schema.ObjectId, required: true, ref: 'course',
  }],
  courseEditable: { type: Boolean, required: true, default: true }
});

const Student = mongoose.model('student', StudentSchema, 'student');

module.exports = {
  Student
};
  