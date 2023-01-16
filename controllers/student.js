const { Student } = require("../Models/student");
const { Course } = require("../Models/course");
const { Attendance } = require("../Models/attendance");

async function login(req, res) {
  console.log("Student login ...");

  const { email, password } = req.body;

  if (!email || !password)
    return res.status(401).send("Include email and password in request body !");

  try {
    const user = await Student.findOne({
      email,
      password,
    });

    if (!user) res.status(404).send(`Login Failed !!`);
    else {
      console.log("Login Successful ", user._id);
      res.status(200).send(user._id);
    }
  } catch (e) {
    res.status(501).send(`Error: ${e}`);
  }
}

async function register(req, res) {
  console.log("Registering Student ...");

  const { usn, name, email, phone, password } = req.body;

  if (!email || !name || !phone || !usn || !password)
    return res
      .status(401)
      .send(
        "Include valid name, email, password, phone number and usn within request body"
      );

  let Curr_Student;
  try {
    Curr_Student = await Student.findOne({
      usn,
    });
  } catch (e) {
    return res.status(501).send(`Error : ${e}`);
  }

  if (Curr_Student) return res.status(401).send(`User Already Exists`);

  try {
    await new Student({
      usn,
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

async function register_courses(req, res) {
  const { key, courseName } = req.body;

  if (!key || !courseName)
    return res.status(401).send("Include key and course list in request body");

  // if (!student.courseEditable)
  //   return res.status(400).send("Course cannot be edited at the moment !");

  const isCourse = await Course.findOne({ name: courseName });

  console.log("isCourse \n" + isCourse);

  if (!isCourse) return res.status(401).send("Course doesnt exists");

  let StudentCourse;
  try {
    StudentCourse = await Student.findOne({
      _id: key,
    });
  } catch (e) {
    return res.status(501).send(`Error ${e}`);
  }

  console.log("StudentCourse\n" + StudentCourse.courses.includes(isCourse._id));

  if (!StudentCourse.courses.includes(isCourse._id)) {
    console.log("_id " + isCourse._id);
    console.log("name " + isCourse.name);

    await Student.updateOne(
      {
        _id: key,
      },
      {
        $push: { courses: isCourse._id },
      }
    );
    return res.status(200).send("Course updated");
  }
  return res.status(201).send("Course Already Exsiting");
}

async function get_attendance(req, res) {
  const { key } = req.body;
  let CourseAndAtttendances = [];

  try {
    const CurrentStudent = await Student.findOne({
      _id: key,
    });

    console.log("CurrentStudent \n\n" + CurrentStudent);

    if (CurrentStudent.courses == null)
      return res.status(401).send(`NO courses registerd`);

    for (const each_Course of CurrentStudent.courses) {
      console.log("each_Course\n" + each_Course);

      let present = 0;

      try {
        const each_Course_Attendance = await Attendance.find(
          {
            course: each_Course,
          },
          {
            students: 1,
          }
        );

        // console.log("each_Course_Attendance\n" + each_Course_Attendance);
        // console.log("students \n" + each_Course_Attendance[0].students);

        let totalClassesOfEachCourse = each_Course_Attendance.length;
        console.log("totalClassesOfEachCourse \n" + totalClassesOfEachCourse);

        for (const eachDay of each_Course_Attendance) {
          console.log("eachDay \n " + eachDay);
          for (const EachStudent of eachDay.students) {
            console.log("student : \n", EachStudent);
            console.log("CurrentStudent.usn \n" + CurrentStudent.usn);
            if (CurrentStudent.usn == EachStudent.usn && EachStudent.present) {
              present++;
              console.log("present \n" + present);
            }
          }
        }

        let percentage = (present / totalClassesOfEachCourse) * 100;
        // console.log("percentage \n" + percentage);

        try {
          const CourseData = await Course.findOne({
            _id: each_Course,
          });

          let EachCourseFinalData = {
            name: CourseData.name,
            Attendancepercentage: percentage,
          };

          console.log("EachCourseFinalData\n" + EachCourseFinalData.name);

          CourseAndAtttendances.push(EachCourseFinalData);
          // console.log("CourseAndAtttendances\n" + CourseAndAtttendances);
        } catch (e) {
          return res.status(501).send(`Error ${e}`);
        }
      } catch (e) {
        return res.status(501).send(`Error ${e}`);
      }
    }

    return res.status(201).send({ CourseAndAtttendances });
  } catch (e) {
    return res.status(501).send(`Error ${e}`);
  }
}

async function get_profile(req, res) {
  const { key } = req.body;

  if (!key) return res.status(401).send("Include key within request body !");

  try {
    const student = await Student.findOne({ _id: key }, null, {
      populate: {
        path: "courses",
      },
    });

    return res.status(200).send(student);
  } catch (e) {
    return res.status(501).send(`Error: ${e}`);
  }
}

module.exports = {
  login,
  register,
  register_courses,
  get_profile,
  get_attendance,
};
