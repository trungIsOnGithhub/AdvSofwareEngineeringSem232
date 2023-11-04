const mongoose = require("mongoose");

import ExamSchema from "../schema/examSchema.js";

module.exports = mongoose.model("Exam", ExamSchema);