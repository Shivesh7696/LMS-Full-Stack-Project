import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

import {
  isValidObjectId
} from "../utils/validation.js";

const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (
      !courseId ||
      typeof courseId !== "string" ||
      !courseId.trim()
    ) {
      return res.status(400).json({
        message: "Course ID is required"
      });
    }

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
      return res.status(400).json({
        message: "Course is not available for enrollment"
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      student: req.user.userId,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: "Already enrolled in this course"
      });
    }

    const enrollment = await Enrollment.create({
      student: req.user.userId,
      course: courseId
    });

    res.status(201).json({
      message: "Enrolled successfully",
      enrollment
    });
  } catch (error) {
    console.log("ENROLL COURSE ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user.userId
    })
      .populate(
        "course",
        "title description price published instructor"
      )
      .sort({ createdAt: -1 });

    res.json({
      enrollments
    });
  } catch (error) {
    console.log("GET MY ENROLLMENTS ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const checkEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user.userId,
      course: req.params.courseId
    });

    if (!enrollment) {
      return res.status(403).json({
        enrolled: false,
        message: "You are not enrolled in this course"
      });
    }

    res.json({
      enrolled: true,
      enrollment
    });
  } catch (error) {
    console.log("CHECK ENROLLMENT ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    if (course.instructor.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to view these students"
      });
    }

    const enrollments = await Enrollment.find({
      course: course._id
    })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json({
      course: {
        id: course._id,
        title: course.title
      },
      students: enrollments
    });
  } catch (error) {
    console.log("GET COURSE STUDENTS ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export {
  enrollInCourse,
  getMyEnrollments,
  checkEnrollment,
  getCourseStudents
};