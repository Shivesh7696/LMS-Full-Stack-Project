import express from "express";

import {
  createLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson
} from "../controllers/lessonController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create lesson
router.post(
  "/",
  authMiddleware,
  roleMiddleware("instructor"),
  createLesson
);

// Get lessons by course
router.get(
  "/course/:courseId",
  authMiddleware,
  getLessonsByCourse
);

// Get instructor's own course lessons
router.get(
  "/instructor/course/:courseId",
  authMiddleware,
  roleMiddleware("instructor"),
  getLessonsByCourse
);

// Get lesson by ID
router.get(
  "/:id",
  authMiddleware,
  getLessonById
);

// Update lesson
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("instructor"),
  updateLesson
);

// Delete lesson
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("instructor"),
  deleteLesson
);

export default router;