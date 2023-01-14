const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  dateString: { type: String },
  course: { type: mongoose.Schema.ObjectId, required: true, ref: "course" },
  students: [
    {
      // usn: { type: mongoose.Schema.ObjectId, required: true, ref: "student" , unique:false},
      usn : {type : String },
      present: { type: Boolean, required: true },
    },
  ],
});

const Attendance = mongoose.model("attendance", AttendanceSchema, "attendance");

module.exports = {
  Attendance,
};
