import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    score: {
      type: Number,
      required: true
    },

    totalQuestions: {
      type: Number,
      required: true
    },

    percentage: {
      type: Number,
      required: true
    },

    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },

        selectedAnswer: {
          type: String,
          required: true
        },

        isCorrect: {
          type: Boolean,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

quizResultSchema.index(
  { student: 1, quiz: 1 },
  { unique: true }
);

const QuizResult = mongoose.model(
  "QuizResult",
  quizResultSchema
);

export default QuizResult;