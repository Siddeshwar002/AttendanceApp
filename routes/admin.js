const express = require('express');
const bodyParser = require('body-parser');
const { get_courses, create_course, enable_course_edit, disable_course_edit } = require('../controllers/admin')

const router = express.Router()

router.use(bodyParser.json());


router.post('/get-courses', get_courses)
router.post('/create-course', create_course)
router.post('/enable-course-edit', enable_course_edit)
router.post('/disable-course-edit', disable_course_edit)

module.exports = router;
