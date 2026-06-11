import { validationResult } from "express-validator";
import { ApiError } from "../utils/apiError.js";

export const validate = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path,
      message: error.msg
    }));

    if (formattedErrors.some((error) => error.message === "Invalid CNIC or Phone number format")) {
      return next(
        new ApiError(422, "Invalid CNIC or Phone number format", formattedErrors)
      );
    }

    return next(
      new ApiError(
        422,
        "Please fix the highlighted fields",
        formattedErrors
      )
    );
  }

  next();
};
