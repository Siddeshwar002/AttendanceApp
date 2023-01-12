const express = require('express');
const bodyParser = require('body-parser');
const {
  login,
  register,
  register_courses,
  get_profile,
  get_attendance,
} = require("../controllers/student");

const router = express.Router()

router.use(bodyParser.json());

router.post('/login', login)
router.post('/register', register)
router.post('/register-courses', register_courses)
router.post('/profile', get_profile)
router.post("/get-attendance", get_attendance);


module.exports = router;
