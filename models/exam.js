const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionContent: { type: String, required: true },
  options: [{
    option: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
  }]
});

const examSchema = new mongoose.Schema({
  examName: { type: String, required: true },
  questions: [questionSchema]
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;