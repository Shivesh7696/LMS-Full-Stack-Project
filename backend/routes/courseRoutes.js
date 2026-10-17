import express from "express";

import {
  createCourse,
  getCourses,
  getCourseById,
  getMyCourses,
  getMyCourseLessons,
  updateCourse,
  deleteCourse
} from "../controllers/courseController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create course
router.post(
  "/",
  authMiddleware,
  roleMiddleware("instructor"),
  createCourse
);

// Get all courses
router.get("/", getCourses);

// Get instructor's own courses
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("instructor"),
  getMyCourses
);

// Get lessons of instructor's own course
router.get(
  "/instructor/course/:courseId",
  authMiddleware,
  roleMiddleware("instructor"),
  getMyCourseLessons
);

// Get course by ID
router.get(
  "/:id",
  authMiddleware,
  getCourseById
);

// Update course
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("instructor"),
  updateCourse
);

// Delete course
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("instructor"),
  deleteCourse
);

export default router;