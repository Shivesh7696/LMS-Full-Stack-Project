import mongoose from "mongoose";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Enrollment from "../models/Enrollment.js";
import Progress from "../models/Progress.js";
import Quiz from "../models/Quiz.js";
import QuizResult from "../models/QuizResult.js";

import {
  isValidString,
  isValidNumber,
  isValidObjectId
} from "../utils/validation.js";

const createCourse = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    if (!isValidString(title)) {
      return res.status(400).json({
        message: "Course title is required"
      });
    }

    if (!isValidString(description)) {
      return res.status(400).json({
        message: "Course description is required"
      });
    }

    if (
      price !== undefined &&
      !isValidNumber(price)
    ) {
      return res.status(400).json({
        message: "Course price must be a number"
      });
    }

    const course = await Course.create({
      title: title.trim(),
      description: description.trim(),
      price,
      instructor: req.user.userId
    });

    res.status(201).json({
      message: "Course created successfully",
      course
    });
  } catch (error) {
    console.log("CREATE COURSE ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email");

    res.json({
      courses
    });
  } catch (error) {
    console.log("GET COURSES ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const getCourseById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid course ID"
      });
    }

    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    if (
      !course.published &&
      course.instructor._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "This course is not published"
      });
    }

    res.json({
      course
    });
  } catch (error) {
    next(error);
  }
};

const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      instructor: req.user.userId
    })
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.json({
      courses
    });
  } catch (error) {
    console.log("GET MY COURSES ERROR:", error);

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

const updateCourse = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid course ID"
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to update this course"
      });
    }

    const {
      title,
      description,
      price,
      published
    } = req.body;

    if (title !== undefined) {
      if (!isValidString(title)) {
        return res.status(400).json({
          message: "Course title cannot be empty"
        });
      }

      course.title = title.trim();
    }

    if (description !== undefined) {
      if (!isValidString(description)) {
        return res.status(400).json({
          message: "Course description cannot be empty"
        });
      }

      course.description = description.trim();
    }

    if (price !== undefined) {
      if (!isValidNumber(price)) {
        return res.status(400).json({
          message: "Course price must be a number"
        });
      }

      course.price = price;
    }

    if (published !== undefined) {
      if (typeof published !== "boolean") {
        return res.status(400).json({
          message: "Published must be true or false"
        });
      }

      course.published = published;
    }

    await course.save();

    res.json({
      message: "Course updated successfully",
      course
    });
  } catch (error) {
    console.log("UPDATE COURSE ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const deleteCourse = async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    if (!isValidObjectId(req.params.id)) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        message: "Invalid course ID"
      });
    }

    const course = await Course.findById(req.params.id).session(session);

    if (!course) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        message: "Course not found"
      });
    }

    if (course.instructor.toString() !== req.user.userId) {
      await session.abortTransaction();
      session.endSession();

      return res.status(403).json({
        message: "You are not allowed to delete this course"
      });
    }

    await Lesson.deleteMany(
      { course: course._id },
      { session }
    );

    await Enrollment.deleteMany(
      { course: course._id },
      { session }
    );

    await Progress.deleteMany(
      { course: course._id },
      { session }
    );

    await Quiz.deleteMany(
      { course: course._id },
      { session }
    );

    await QuizResult.deleteMany(
      { course: course._id },
      { session }
    );

    await course.deleteOne({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "Course and all related data deleted successfully"
    });
  } catch (error) {
    console.log("DELETE COURSE ERROR:", error);

    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      message: "Failed to delete course"
    });
  }
};

export {
  createCourse,
  getCourses,
  getCourseById,
  getMyCourses,
  getMyCourseLessons,
  updateCourse,
  deleteCourse
};