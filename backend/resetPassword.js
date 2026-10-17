import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import connectDB from "./config/db.js";
import User from "./models/User.js";

const resetPassword = async () => {
  try {
    await connectDB();

    const email = "test@gmail.com";
    const newPassword = "LmsTest@123";

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.role = "instructor";

    await user.save();

    console.log("Instructor password reset successfully");
    console.log("Email:", email);
  } catch (error) {
    console.error("Password reset failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

resetPassword();