
import Quiz from "../models/Quiz.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import QuizResult from "../models/QuizResult.js";

import {
  isValidString,
  isValidObjectId
} from "../utils/validation.js";

const createQuiz = async (req, res) => {
  try {
    const { title, courseId, questions } = req.body;

    if (!isValidString(title)) {
      return res.status(400).json({ message: "Quiz title is required" });
    }

    if (!isValidString(courseId)) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    if (!isValidObjectId(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "At least one question is required" });
    }

    for (const question of questions) {
      if (!isValidString(question.question)) {
        return res.status(400).json({ message: "Question text is required" });
      }

      if (!Array.isArray(question.options) || question.options.length < 2) {
        return res.status(400).json({ message: "Each question must have at least 2 options" });
      }

      if (!isValidString(question.correctAnswer)) {
        return res.status(400).json({ message: "Correct answer is required" });
      }

      if (!question.options.includes(question.correctAnswer)) {
        return res.status(400).json({ message: "Correct answer must be one of the options" });
      }
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to create a quiz for this course"
      });
    }

    const quiz = await Quiz.create({
      title: title.trim(),
      course: courseId,
      questions
    });

    return res.status(201).json({
      message: "Quiz created successfully",
      quiz
    });
  } catch (error) {
    console.log("CREATE QUIZ ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getQuizById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const course = await Course.findById(quiz.course);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.published) {
      return res.status(403).json({ message: "This course is not published" });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user.userId,
      course: quiz.course
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You are not enrolled in this course"
      });
    }

    const questions = quiz.questions.map((question) => ({
      _id: question._id,
      question: question.question,
      options: question.options
    }));

    return res.json({
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        course: quiz.course,
        questions
      }
    });
  } catch (error) {
    console.log("GET QUIZ ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getInstructorQuizById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const course = await Course.findById(quiz.course);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to view this quiz"
      });
    }

    return res.json({ quiz });
  } catch (error) {
    console.log("GET INSTRUCTOR QUIZ ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const submitQuiz = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    const { answers = [] } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers must be an array" });
    }

    for (const answer of answers) {
      if (
        !answer ||
        !answer.questionId ||
        !isValidObjectId(answer.questionId)
      ) {
        return res.status(400).json({
          message: "Invalid question ID in answers"
        });
      }

      if (typeof answer.selectedAnswer !== "string") {
        return res.status(400).json({
          message: "Selected answer must be a string"
        });
      }
    }

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const course = await Course.findById(quiz.course);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.published) {
      return res.status(403).json({
        message: "This course is not published"
      });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user.userId,
      course: quiz.course
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You are not enrolled in this course"
      });
    }

    const existingResult = await QuizResult.findOne({
      student: req.user.userId,
      quiz: quiz._id
    });

    if (existingResult) {
      return res.status(409).json({
        message: "You have already attempted this quiz"
      });
    }

    const submittedIds = new Set();

    for (const answer of answers) {
      const questionId = answer.questionId.toString();

      const question = quiz.questions.find(
        (item) => item._id.toString() === questionId
      );

      if (!question) {
        return res.status(400).json({
          message: "Question does not belong to this quiz"
        });
      }

      if (submittedIds.has(questionId)) {
        return res.status(400).json({
          message: "Duplicate question answers are not allowed"
        });
      }

      submittedIds.add(questionId);

      if (
        answer.selectedAnswer !== "" &&
        !question.options.includes(answer.selectedAnswer)
      ) {
        return res.status(400).json({
          message: "Selected answer is not a valid option"
        });
      }
    }

    let score = 0;

    const checkedAnswers = quiz.questions.map((question) => {
      const submittedAnswer = answers.find(
        (answer) =>
          answer.questionId.toString() === question._id.toString()
      );

      const selectedAnswer = submittedAnswer
        ? submittedAnswer.selectedAnswer
        : "";

      const isCorrect = selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        score++;
      }

      return {
        questionId: question._id,
        selectedAnswer,
        isCorrect
      };
    });

    const totalQuestions = quiz.questions.length;

    const percentage = totalQuestions > 0
      ? (score / totalQuestions) * 100
      : 0;

    const result = await QuizResult.create({
      student: req.user.userId,
      quiz: quiz._id,
      course: quiz.course,
      score,
      totalQuestions,
      percentage,
      answers: checkedAnswers
    });

    return res.status(201).json({
      message: "Quiz submitted successfully",
      result
    });
  } catch (error) {
    console.log("SUBMIT QUIZ ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getMyQuizResults = async (req, res) => {
  try {
    const results = await QuizResult.find({
      student: req.user.userId
    })
      .populate("quiz", "title")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    return res.json({ results });
  } catch (error) {
    console.log("GET MY QUIZ RESULTS ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateQuiz = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const course = await Course.findById(quiz.course);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to update this quiz"
      });
    }

    const { title, questions } = req.body;

    if (title !== undefined) {
      if (!isValidString(title)) {
        return res.status(400).json({
          message: "Quiz title cannot be empty"
        });
      }

      quiz.title = title.trim();
    }

    if (questions !== undefined) {
      if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
          message: "At least one question is required"
        });
      }

      for (const question of questions) {
        if (!isValidString(question.question)) {
          return res.status(400).json({ message: "Question text is required" });
        }

        if (!Array.isArray(question.options) || question.options.length < 2) {
          return res.status(400).json({
            message: "Each question must have at least 2 options"
          });
        }

        if (!isValidString(question.correctAnswer)) {
          return res.status(400).json({
            message: "Correct answer is required"
          });
        }

        if (!question.options.includes(question.correctAnswer)) {
          return res.status(400).json({
            message: "Correct answer must be one of the options"
          });
        }
      }

      quiz.questions = questions;
    }

    await quiz.save();

    return res.json({
      message: "Quiz updated successfully",
      quiz
    });
  } catch (error) {
    console.log("UPDATE QUIZ ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const course = await Course.findById(quiz.course);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to delete this quiz"
      });
    }

    await QuizResult.deleteMany({ quiz: quiz._id });
    await quiz.deleteOne();

    return res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.log("DELETE QUIZ ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getMyQuizzes = async (req, res) => {
  try {
    const courses = await Course.find({
      instructor: req.user.userId
    }).select("_id");

    const courseIds = courses.map((course) => course._id);

    const quizzes = await Quiz.find({
      course: { $in: courseIds }
    })
      .populate("course", "title")
      .sort({ createdAt: -1 });

    return res.json({ quizzes });
  } catch (error) {
    console.log("GET MY QUIZZES ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
const getQuizzesByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!isValidObjectId(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID"
      });
    }

    const course = await Course.findById(courseId);

    if (!course || !course.published) {
      return res.status(404).json({
        message: "Published course not found"
      });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user.userId,
      course: courseId
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "Please enroll in this course first"
      });
    }

    const quizzes = await Quiz.find({ course: courseId })
      .select("title course questions");

    const safeQuizzes = quizzes.map((quiz) => ({
      _id: quiz._id,
      title: quiz.title,
      course: quiz.course,
      questionCount: quiz.questions.length
    }));

    return res.status(200).json({
      quizzes: safeQuizzes
    });
  } catch (error) {
    next(error);
  }
};

export {
  createQuiz,
  getQuizById,
  getInstructorQuizById,
  submitQuiz,
  getMyQuizResults,
  updateQuiz,
  deleteQuiz,
  getMyQuizzes,
  getQuizzesByCourse 
};

