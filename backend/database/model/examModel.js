import mongoose from "mongoose";

import ExamSchema from "../schema/examSchema.js";

export default mongoose.model("Exam", ExamSchema);