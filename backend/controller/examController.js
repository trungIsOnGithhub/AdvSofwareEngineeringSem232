import examModel from "../database/model/examModel.js";
import UserModel from "../database/model/userModel.js";

let exams = [ {name: "Bai Kiem tra 1", password: "1234", owner:"user1"} ];
let users = [
    { _id: "dj183u21uq", username: "user1", password: "1234", email: "aa@aa.aa", role: "teacher" },
    { _id: "dj3218290d", username: "user2", password: "1234", email: "bb@bb.bb", role: "student" }
];
// FOR TESTING

export const getExamByTeacherUsername = async (req, res) => {
    try {
        const reqUsername = req.params.user;
        console.log(username);
        const exam = await examModel.find({username: reqUsername});

        return res.status(200).json(exam);
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message);
    }
}

export const getExam = async (req, res) => {
    try {
        const findAllExam = await examModel.find();
        return res.status(200).json(findAllExam);
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message);
    }
}

export const createExam = async (req, res) => {
    try {
        if (!req.body.userId || !req.body.name || !req.body.password) {
            return res.status(500).json({
                message: 'Missing input!',
                status: 500
            })
        }

        const findTeacher = await UserModel.find({ id: req.body.userId });
        if (!findTeacher) {
            return res.status(404).json({
                message: 'Not found teacher'
            })
        }
        const exam = new examModel({ name: req.body.name, password: req.body.password });

        // listExam.push(exam);
        return res.status(200).json(await exam.save());
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

// export 