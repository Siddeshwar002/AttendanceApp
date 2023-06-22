const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const lecturerRouter = require('./routes/lecturer');
const studentRouter = require('./routes/student');
const adminRouter = require('./routes/admin')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require("mongoose");

mongoose.connect("<MongoDB Atlas URL>").then(() => {
  console.log("Connected to DB ...");
});


// mongoose
//   .connect(
//     "mongodb+srv://SherLock_Holmes:Sid@MongoDB02@cluster0.wlggz35.mongodb.net/test")
//   .then(() => {
//     console.log("Connected to DB ...");
//   });


// mongoose
//   .connect("mongodb://localhost:27017/AttendaceApp")
//   .then(() => {
//     console.log("Connected to DB ...");
//   });



app.use("/lecturer", lecturerRouter);
app.use("/student", studentRouter);
app.use("/admin", adminRouter);

app.listen(3000, function () {
  console.log('SERVER STARTED ON localhost:3000');
});
