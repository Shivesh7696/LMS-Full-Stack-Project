import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Progress from "../models/Progress.js";

import {
  isValidString,
  isValidNumber,
  isValidObjectId
} from "../utils/validation.js";

const createLesson = async (req, res) => {
  try {
    const { title, content, courseId, order } = req.body;

    if (!isValidString(title)) {
      return res.status(400).json({
        message: "Lesson title is required"
      });
    }

    if (!isValidString(content)) {
      return res.status(400).json({
        message: "Lesson content is required"
      });
    }

    if (!isValidString(courseId)) {
      return res.status(400).json({
        message: "Course ID is required"
      });
    }

    if (!isValidObjectId(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID"
      });
    }

    if (!isValidNumber(order)) {
      return res.status(400).json({
        message: "Lesson order must be a number"
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to add lessons to this course"
      });
    }

    const lesson = await Lesson.create({
      title: title.trim(),
      content: content.trim(),
      course: courseId,
      order
    });

    res.status(201).json({
      message: "Lesson created successfully",
      lesson
    });
  } catch (error) {
    console.log("CREATE LESSON ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const getLessonsByCourse = async (req, res) => {
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

    if (
      !course.published &&
      course.instructor.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "This course is not published"
      });
    }

    if (course.instructor.toString() === req.user.userId) {
      const lessons = await Lesson.find({
        course: courseId
      }).sort({ order: 1 });

      return res.json({
        lessons
      });
    }

    if (req.user.role === "student") {
      const enrollment = await Enrollment.findOne({
        student: req.user.userId,
        course: courseId
      });

      if (!enrollment) {
        return res.status(403).json({
          message: "You are not enrolled in this course"
        });
      }

      const lessons = await Lesson.find({
        course: courseId
      }).sort({ order: 1 });

      return res.json({
        lessons
      });
    }

    return res.status(403).json({
      message: "You are not allowed to access these lessons"
    });
  } catch (error) {
    console.log("GET LESSONS BY COURSE ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const getMyCourseLessons = async (req, res) => {
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

    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to view these lessons"
      });
    }

    const lessons = await Lesson.find({
      course: course._id
    }).sort({ order: 1 });

    res.json({
      course: {
        id: course._id,
        title: course.title
      },
      lessons
    });
  } catch (error) {
    console.log("GET MY COURSE LESSONS ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const getLessonById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid lesson ID"
      });
    }

    const lesson = await Lesson.findById(req.params.id);

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

    if (
      !course.published &&
      course.instructor.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "This course is not published"
      });
    }

    if (course.instructor.toString() === req.user.userId) {
      return res.json({
        lesson
      });
    }

    if (req.user.role === "student") {
      const enrollment = await Enrollment.findOne({
        student: req.user.userId,
        course: course._id
      });

      if (!enrollment) {
        return res.status(403).json({
          message: "You are not enrolled in this course"
        });
      }

      return res.json({
        lesson
      });
    }

    return res.status(403).json({
      message: "You are not allowed to access this lesson"
    });
  } catch (error) {
    console.log("GET LESSON BY ID ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const updateLesson = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid lesson ID"
      });
    }

    const lesson = await Lesson.findById(req.params.id);

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

    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to update this lesson"
      });
    }

    const { title, content, order } = req.body;

    if (title !== undefined) {
      if (!isValidString(title)) {
        return res.status(400).json({
          message: "Lesson title cannot be empty"
        });
      }

      lesson.title = title.trim();
    }

    if (content !== undefined) {
      if (!isValidString(content)) {
        return res.status(400).json({
          message: "Lesson content cannot be empty"
        });
      }

      lesson.content = content.trim();
    }

    if (order !== undefined) {
      if (!isValidNumber(order)) {
        return res.status(400).json({
          message: "Lesson order must be a number"
        });
      }

      lesson.order = order;
    }

    await lesson.save();

    res.json({
      message: "Lesson updated successfully",
      lesson
    });
  } catch (error) {
    console.log("UPDATE LESSON ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const deleteLesson = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid lesson ID"
      });
    }

    const lesson = await Lesson.findById(req.params.id);

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

    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to delete this lesson"
      });
    }

    await Progress.deleteMany({
      lesson: lesson._id
    });

    await lesson.deleteOne();

    res.json({
      message: "Lesson deleted successfully"
    });
  } catch (error) {
    console.log("DELETE LESSON ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export {
  createLesson,
  getLessonsByCourse,
  getMyCourseLessons,
  getLessonById,
  updateLesson,
  deleteLesson
};