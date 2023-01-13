const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  dateString: { type: String, unique: true },
  course: { type: mongoose.Schema.ObjectId, required: true, ref: "course" },
  students: [
    {
      // usn: { type: mongoose.Schema.ObjectId, required: true, ref: "student" },
      usn : {type : String , unique : true},
      present: { type: Boolean, required: true },
    },
  ],
});

const Attendance = mongoose.model("attendance", AttendanceSchema, "attendance");

module.exports = {
  Attendance,
};
