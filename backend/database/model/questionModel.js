import mongoose from "mongoose";
import QuestionSchema from "../schema/questionSchema.js";

const Question = mongoose.model("Question", QuestionSchema);

export default Question;