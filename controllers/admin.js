const mongoose = require("mongoose");
const { Course } = require('../Models/course')
const { Student } = require('../Models/student')


async function get_courses(req, res) {

    try {
        const courses = await Course.find({});
        if (!courses) return res.status(404).send('Lecturer not found !!!');

        return res.status(200).send(courses)
    } catch (e) {
        return res.status(501).send(`Error: ${e}`);
    }

}

async function create_course(req, res){

    const { name, courseCode } = req.body;

    if (!name || !courseCode) return res.status(401).send('Include name and courseCode in request body !');

    try {
        await new Course({
            name,
            courseCode
        }).save();
        return res.status(200).send('Course created successfully !');
    } catch (e) {
        return res.status(501).send(`Error: ${e}`);
    }

}

async function enable_course_edit(req, res) {
    const students = await Student.find({});

    for (const student of students) {
        try{
            await Student.updateOne({_id: student._id}, {courseEditable: true});
        } catch (e) {
            console.log(`Error for: ${student}`);
        }
    }

    return res.status(200).send('All courses are now editable !');
}

async function disable_course_edit(req, res) {
    const students = await Student.find({});

    for (const student of students) {
        try{
            await Student.updateOne({_id: student._id}, {courseEditable: false});
        } catch (e) {
            console.log(`Error for: ${student}`);
        }
    }

    return res.status(200).send('All courses are now no longer editable !');
}

module.exports = {
    get_courses,
    create_course,
    enable_course_edit,
    disable_course_edit
};
