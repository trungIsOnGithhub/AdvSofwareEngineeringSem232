import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    title: { type: String, required: true, index: "text" },
    options: [{ type: String, required: true }],
    answer: { type: String, required: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
});

export default QuestionSchema;
