const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
  lecturerID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  courses: [{ type: mongoose.Schema.ObjectId, ref: "course" }],
});

const Lecturer = mongoose.model("lecturer", LectureSchema, "lecturer");

module.exports = {
  Lecturer,
};

// lecturerID is UNIQUE
// So if the same ID is used again then also it wont create a new entry in collection
// mongoDB itself checks if its UNIQUE or no
// if not uniqe then catch(e) block gets executed
