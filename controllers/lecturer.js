const mongoose = require("mongoose");
const { Lecturer } = require("../Models/lecturer");
const { Attendance } = require("../Models/attendance");
const { Course } = require("../Models/course");
const { Student } = require("../Models/student");
const { ReadConcern } = require("mongodb");

async function login(req, res) {
  console.log("Lecturer login ...");

  const { email, password } = req.body;

  if (!email || !password)
    return res.status(401).send("Include email and password in request body !");

  try {
    const user = await Lecturer.findOne({
      email,
      password,
    });

    if (!user) res.status(404).send(`Login Failed !!`);
    else {
      // Login succesfull, Sending the ID
      console.log("Login Successful ", user._id);
      res.status(201).send(user._id);
    }
  } catch (e) {
    res.status(501).send(`Error: ${e}`);
  }
}

async function register(req, res) {
  console.log("Registering Lecturer ...");

  const { lecturerID, name, email, phone, password, courses } = req.body;

  if (!email || !name || !phone || !lecturerID || !password)
    return res
      .status(401)
      .send(
        "Include valid name, email, password, phone number and lecturerID within request body"
      );

  try {
    await new Lecturer({
      lecturerID,
      name,
      email,
      phone,
      password,
    }).save();

    res.status(200).send("Registration Successful");
  } catch (e) {
    res.status(501).send(`User already Exists`);
  }
}

async function get_courses(req, res) {
  const { key } = req.body;

  if (!key) return res.status(401).send("Include key in request body !");

  try {
    const user = await Lecturer.findOne({
      _id: mongoose.Types.ObjectId(key),
    });
    if (!user) return res.status(404).send("Lecturer not found !!!");

    for (eachCourse of user.courses) {
      try {
        const courseDetails = await Course.find({
          key: eachCourse,
        });

        return res.status(200).send(courseDetails);
      } catch (e) {
        res.status(502).send(`Error ${e}`);
      }
    }

    return res.status(200).send("No courses Yet");
  } catch (e) {
    return res.status(501).send(`Error: ${e}`);
  }
}

async function add_course(req, res) {
  const { key, lecturerID, name, courseCode } = req.body;

  console.log(key + "\n" + name + "\n" + courseCode);

  if (!key || !name || !courseCode)
    return res.status(401).send("Include key and courseName");

  // check if course already exists
  try {
    const course = await Course.findOne({
      name,
      courseCode,
    });

    if (course) return res.status(201).send(`course already exists`);
  } catch (e) {
    return res.status(501).send(`Error : ${e}`);
  }

  // course doesnt exists and creating it now
  try {
    await new Course({
      name,
      courseCode,
    }).save();

    // finding the course form course coll
    try {
      const newCourse = await Course.findOne({
        name,
        courseCode,
      });

      console.log("Reach 1 \n" + newCourse);

      // updating the course in lecture coll
      try {
        await Lecturer.updateOne(
          {
            lecturerID,
          },
          {
            $push: {
              courses: newCourse,
            },
          }
        );
      } catch (e) {
        return res.status(501).send(`Error ${e}`);
      }
    } catch (e) {
      return res.status(501).send(`Error : ${e}`);
    }

    res
      .status(200)
      .send(
        `[+] course created sucessfully and [+] updated into lectures courses `
      );
  } catch (e) {
    return res.status(501).send(`Error : ${e}`);
  }
}

async function add_attendance(req, res) {
  // {
  //   "key": "6397406b66f300fac7b1a947",
  //     "dateString": "12122022",
  //     "course": "19CS6PCCNS",
  //     "attendances": [
  //   {
  //     "student": "1BM19CS101",
  //     "attendance": true
  //   }
  // ]
  // }

  const { key, attendances, dateString, course } = req.body;

  if (!key || !attendances || !dateString || !course)
    return res
      .status(401)
      .send(
        "Include key, course, dateString and attendance array in request body !"
      );

  const course_exists = await Course.findOne({ name: course });

  if (!course_exists) return res.status(404).send("Invalid course code !");

  for (const entry of attendances) {
    console.log(entry);

    // checks for the student
    const student_exists = await Student.findOne({ usn: entry.student });
    console.log(student_exists);

    // if we find enrty of student who hasn't been registerd yet
    if (!student_exists) continue;

    const attendance_exists = await Attendance.findOne({
      dateString: dateString,
    });

    // once the attendance for the particular date and course
    // has been created, this below code gets executed
    if (attendance_exists) {
      try {
        await Attendance.updateOne(
          { dateString: dateString },
          {
            $push: {
              students: {
                usn: student_exists._id,
                present: entry.attendance,
              },
            },
          }
        );
      } catch (e) {
        console.log(e);
        return res.status(401).send(`cant update the same `);
      }
    }

    // first time adding the attendace data
    // works for the first entry of the student's data
    try {
      await new Attendance({
        dateString,
        course: course_exists._id,
        students: [
          {
            usn: student_exists._id,
            present: entry.attendance,
          },
        ],
      }).save();
    } catch (e) {
      return res.status(401).send(`cant update the same `);
    }

    return res.status(200).send("Attendance updated !");
  }
}

async function get_attendance(req, res) {
  const { courseName } = req.body;

  if (!courseName) return res.status(401).send(`Invalid key and name`);

  let course;
  try {
    course = await Course.findOne({
      name: courseName,
    });
  } catch (e) {
    return res.status(501).send(`Error 1 : ${e}`);
  }

  let Course_Attendance;
  try {
    Course_Attendance = await Attendance.find(
      {
        course: course._id,
      },
      {
        students: 1,
      }
    );
  } catch (e) {
    return res.status(501).send(`Error : ${e}`);
  }

  let Course_Students;
  try {
    Course_Students = await Student.find({
      courses: { $in: course._id },
    });

    // console.log("Course_Students \n" + Course_Students);

    let TotalClasses = Course_Attendance.length;
    let All_Students_Data = [];

    for (const EachStudent of Course_Students) {
      let present = 0;

      for (EachDay of Course_Attendance) {
        for (EachEntry of EachDay.students) {
          if (EachStudent.usn == EachEntry.usn && EachEntry.present) {
            present++;
          }
        }
      }

      let EachStudentData = {
        name: EachStudent.name,
        usn: EachStudent.usn,
        Attendance: (present / TotalClasses) * 100,
      };

      All_Students_Data.push(EachStudentData);
    }

    // console.log("All_Students_Data\n" + All_Students_Data);

    return res.status(201).send({All_Students_Data});
  } catch (e) {
    return res.status(501).send(`Error ${e}`);
  }
}

module.exports = {
  login,
  register,
  get_courses,
  add_attendance,
  add_course,
  get_attendance,
};
