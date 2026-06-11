import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication token is required");
  }

  const token = header.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user || !user.isActive) {
    throw new ApiError(401, "User account is unavailable");
  }

  req.user = user;
  next();
});

export const optionalProtect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user && user.isActive) {
      req.user = user;
    }
  } catch {
    // token invalid — proceed as guest
  }

  next();
});

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, "You do not have permission to access this resource"));
  }

  next();
};
