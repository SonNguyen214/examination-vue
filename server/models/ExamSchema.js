import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  No: { type: Number, required: true },
  question: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  answers: { type: [String], required: true },
  hasAnswerCorrect: { type: Boolean, default: false },
  score: { type: Number, required: true },
});

const ExamSchema = new mongoose.Schema({
  data: { type: [QuestionSchema], required: true },
  timeExpired: { type: Number, required: true },
  timeRemaining: { type: Number, required: true },
  hasSubmitted: { type: Boolean, default: false },
  totalPoint: { type: Number, default: 0 },
  userAnswers: { type: String, default: "{}" },
  title: { type: String, default: "" },
  des: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  expiredAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
});

export default mongoose.models.Exam || mongoose.model("Exam", ExamSchema);
