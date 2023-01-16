const express = require("express");
const bodyParser = require("body-parser");
const {
  login,
  register,
  register_courses,
  get_profile,
  get_attendance,
  delete_course,
} = require("../controllers/student");

const router = express.Router();

router.use(bodyParser.json());

router.post("/login", login);
router.post("/register", register);
router.post("/register-courses", register_courses);
router.post("/profile", get_profile);
router.post("/get-attendance", get_attendance);
router.post("/delete-course", delete_course);

module.exports = router;
