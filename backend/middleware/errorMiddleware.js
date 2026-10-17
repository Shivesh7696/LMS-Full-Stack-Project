const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format"
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate data already exists"
    });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Server error"
  });
};

export default errorMiddleware;