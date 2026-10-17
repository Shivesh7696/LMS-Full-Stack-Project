import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    price: {
      type: Number,
      default: 0
    },

    published: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;