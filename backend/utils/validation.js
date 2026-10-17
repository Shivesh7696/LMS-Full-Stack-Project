import mongoose from "mongoose";

const isValidString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

const isValidNumber = (value) => {
  return typeof value === "number" && !Number.isNaN(value);
};

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export {
  isValidString,
  isValidNumber,
  isValidObjectId
};