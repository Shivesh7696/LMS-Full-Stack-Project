import express from "express";

import {
  createQuiz,
  getQuizById,
  getInstructorQuizById,
  submitQuiz,
  getMyQuizResults,
  updateQuiz,
  deleteQuiz,
  getMyQuizzes,
  getQuizzesByCourse
} from "../controllers/quizController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("instructor"),
  createQuiz
);

router.get(
  "/results/my",
  authMiddleware,
  roleMiddleware("student"),
  getMyQuizResults
);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("instructor"),
  getMyQuizzes
);

router.get(
  "/instructor/:id",
  authMiddleware,
  roleMiddleware("instructor"),
  getInstructorQuizById
);

router.post(
  "/:id/submit",
  authMiddleware,
  roleMiddleware("student"),
  submitQuiz
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("instructor"),
  updateQuiz
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("instructor"),
  deleteQuiz
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("student"),
  getQuizById
);
router.get(
  "/course/:courseId",
  authMiddleware,
  roleMiddleware("student"),
  getQuizzesByCourse
);

export default router;  