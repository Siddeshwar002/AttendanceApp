const { Student } = require("../Models/student");
const { Course } = require("../Models/course");

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

  const student = await Student.findOne({ _id: key });

  if (!student.courseEditable)
    return res.status(400).send("Course cannot be edited at the moment !");

  // for (const course_code of course) {

  const isCourse = await Course.findOne({ name: courseName });
  await Student.updateOne({ _id: key }, { $push: { courses: isCourse._id } });

  // }

  return res.status(200).send("Course updated");
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
};
