const mongoose = require('mongoose');

const submitSchema = new mongoose.Schema({
  examId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
    score: String
}, {timestamps : true});

const Submit = mongoose.model('Submit', submitSchema);

module.exports = Submit;