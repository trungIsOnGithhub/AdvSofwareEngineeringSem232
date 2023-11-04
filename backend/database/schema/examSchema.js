import mongoose from "mongoose";

const ExamSchema = new mongoose.Schema({
    name: { type: String, required: true, index: "text" },
    password: { type: String, required: true },
    owner: { type: String }
},
    { timestamps: true }
)

export default ExamSchema;