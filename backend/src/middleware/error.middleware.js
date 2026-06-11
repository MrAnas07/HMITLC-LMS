import { ApiError } from "../utils/apiError.js";

export const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(error.errors).map((item) => item.message)
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      message: "Duplicate value already exists",
      fields: Object.keys(error.keyPattern || {})
    });
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || "Something went wrong",
    details: error.details || undefined,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack
  });
};
