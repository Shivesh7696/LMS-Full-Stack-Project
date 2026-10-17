import Progress from "../models/Progress.js";
import Lesson from "../models/Lesson.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

import {
  isValidObjectId
} from "../utils/validation.js";

const markLessonComplete = async (req, res) => {
  try {
    const { lessonId } = req.body;

    if (!isValidObjectId(lessonId)) {
      return res.status(400).json({
        message: "Invalid lesson ID"
      });
    }

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found"
      });
    }

    const course = await Course.findById(lesson.course);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    if (!course.published) {
      return res.status(403).json({
        message: "This course is not published"
      });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user.userId,
      course: lesson.course
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You are not enrolled in this course"
      });
    }

    const progress = await Progress.findOneAndUpdate(
      {
        student: req.user.userId,
        lesson: lessonId
      },
      {
        student: req.user.userId,
        course: lesson.course,
        lesson: lessonId,
        completed: true,
        completedAt: new Date()
      },
      {
        returnDocument: "after",
        upsert: true
      }
    );

    res.json({
      message: "Lesson marked as completed",
      progress
    });
  } catch (error) {
    console.log("MARK LESSON COMPLETE ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!isValidObjectId(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID"
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    if (!course.published) {
      return res.status(403).json({
        message: "This course is not published"
      });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user.userId,
      course: courseId
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You are not enrolled in this course"
      });
    }

    const progress = await Progress.find({
      student: req.user.userId,
      course: courseId
    })
      .populate("lesson", "title order")
      .sort({ "lesson.order": 1 });

    res.json({
      courseId,
      progress
    });
  } catch (error) {
    console.log("GET COURSE PROGRESS ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export {
  markLessonComplete,
  getCourseProgress
};