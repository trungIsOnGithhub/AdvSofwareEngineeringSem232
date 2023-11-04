import examModel from "../database/model/examModel.js";

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
        const exam = new examModel({ name: req.body.name, password: req.body.password });

        // listExam.push(exam);
        return res.status(200).json(await exam.save());
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

// export 