import express from "express";
import { isValidObjectId } from "../utils/validation.js";

import {
  enrollInCourse,
  getMyEnrollments,
  checkEnrollment,
  getCourseStudents
} from "../controllers/enrollmentController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


// Enroll in a course
router.post(
  "/",
  authMiddleware,
  roleMiddleware("student"),
  enrollInCourse
);


// Get all courses enrolled by the logged-in student
router.get(
  "/my-courses",
  authMiddleware,
  roleMiddleware("student"),
  getMyEnrollments
);


// Check if the logged-in student is enrolled in a course
router.get(
  "/check/:courseId",
  authMiddleware,
  roleMiddleware("student"),
  checkEnrollment
);
router.get(
  "/course/:courseId/students",
  authMiddleware,
  roleMiddleware("instructor"),
  getCourseStudents
);


export default router;