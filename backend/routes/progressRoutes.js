import express from "express";

import { markLessonComplete,  
         getCourseProgress
 } from "../controllers/progressController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/complete",
  authMiddleware,
  roleMiddleware("student"),
  markLessonComplete
);
router.get(
  "/course/:courseId",
  authMiddleware,
  roleMiddleware("student"),
  getCourseProgress
);

export default router;