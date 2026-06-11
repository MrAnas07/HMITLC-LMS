import { body, query } from "express-validator";
import Course from "../models/Course.js";
import Admission from "../models/Admission.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getFileUrl } from "../middleware/upload.middleware.js";

export const courseRules = [
  body("title").trim().isLength({ min: 3 }).withMessage("Course title is required"),
  body("description").trim().isLength({ min: 20 }).withMessage("Description is too short"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("level").optional({ nullable: true, emptyString: true }).trim(),
  body("price").optional({ nullable: true, emptyString: true }).trim(),
  body("duration").optional({ nullable: true, emptyString: true }).trim()
];

export const listRules = [
  query("search").optional({ nullable: true, emptyString: true }).trim(),
  query("category").optional({ nullable: true, emptyString: true }).trim(),
  query("level").optional({ nullable: true, emptyString: true }).trim()
];

export const listCourses = asyncHandler(async (req, res) => {
  const { search, category, level, mine, all } = req.query;
  const filter = {};

  if (all === "true" && ["teacher", "admin"].includes(req.user?.role)) {
    // Teachers and admins can see all courses (published + unpublished)
  } else if (mine === "true" && ["teacher", "admin"].includes(req.user?.role)) {
    filter.teacher = req.user._id;
  } else {
    filter.isPublished = true;
  }

  if (category) filter.category = category;
  if (level) filter.level = level;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  const courses = await Course.find(filter)
    .populate("teacher", "name email avatarUrl")
    .sort({ createdAt: -1 });

  res.json({ courses });
});

export const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findOne({
    $or: [{ slug: req.params.id }, { _id: req.params.id.match(/^[a-f\d]{24}$/i) ? req.params.id : null }]
  }).populate("teacher", "name email avatarUrl bio skills");

  if (!course) throw new ApiError(404, "Course not found");
  res.json({ course });
});

export const createCourse = asyncHandler(async (req, res) => {
  const thumbnailUrl = getFileUrl(req, req.files?.thumbnail?.[0]);
  const introVideoUrl = getFileUrl(req, req.files?.introVideo?.[0]);
  const resourceFiles = req.files?.resources || [];

  const resources = resourceFiles.map((file) => ({
    title: file.originalname,
    fileUrl: getFileUrl(req, file),
    fileType: file.mimetype
  }));

  let learningOutcomes = [];
  let courseOutline = [];
  try { learningOutcomes = JSON.parse(req.body.learningOutcomes || "[]"); } catch {}
  try { courseOutline = JSON.parse(req.body.courseOutline || "[]"); } catch {}

  const course = await Course.create({
    ...req.body,
    learningOutcomes,
    courseOutline,
    thumbnailUrl,
    introVideoUrl,
    resources,
    teacher: req.user._id,
    isPublished: req.body.isPublished === "true" || req.body.isPublished === true
  });

  res.status(201).json({ course });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, "Course not found");

  const ownsCourse = course.teacher.toString() === req.user._id.toString();
  if (!ownsCourse && req.user.role !== "admin") throw new ApiError(403, "Not allowed");

  const updateData = { ...req.body };
  try { updateData.learningOutcomes = JSON.parse(req.body.learningOutcomes || "[]"); } catch {}
  try { updateData.courseOutline = JSON.parse(req.body.courseOutline || "[]"); } catch {}

  Object.assign(course, updateData);

  const thumbnailUrl = getFileUrl(req, req.files?.thumbnail?.[0]);
  const introVideoUrl = getFileUrl(req, req.files?.introVideo?.[0]);
  if (thumbnailUrl) course.thumbnailUrl = thumbnailUrl;
  if (introVideoUrl) course.introVideoUrl = introVideoUrl;
  if (req.files?.resources?.length) {
    course.resources.push(
      ...req.files.resources.map((file) => ({
        title: file.originalname,
        fileUrl: getFileUrl(req, file),
        fileType: file.mimetype
      }))
    );
  }

  await course.save();
  res.json({ course });
});

export const updateCourseSeats = asyncHandler(async (req, res) => {
  const totalSeats = Number(req.body.totalSeats);
  if (!Number.isInteger(totalSeats) || totalSeats < 1) {
    throw new ApiError(400, "Total seats must be at least 1");
  }

  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, "Course not found");

  const diff = totalSeats - course.totalSeats;
  course.totalSeats = totalSeats;
  course.seatsAvailable = Math.max(0, course.seatsAvailable + diff);
  await course.save();

  res.json({ success: true, course });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, "Course not found");

  const ownsCourse = course.teacher.toString() === req.user._id.toString();
  if (!ownsCourse && req.user.role !== "admin") throw new ApiError(403, "Not allowed");

  await course.deleteOne();

  res.status(204).send();
});

export const upsertLesson = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, "Course not found");
  if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "Not allowed");
  }

  const payload = {
    title: req.body.title,
    durationMinutes: req.body.durationMinutes || 0,
    videoUrl: getFileUrl(req, req.files?.video?.[0]) || req.body.videoUrl,
    resourceUrl: getFileUrl(req, req.files?.resource?.[0]) || req.body.resourceUrl,
    isPreview: req.body.isPreview === "true" || req.body.isPreview === true
  };

  if (req.params.lessonId) {
    const lesson = course.lessons.id(req.params.lessonId);
    if (!lesson) throw new ApiError(404, "Lesson not found");
    Object.assign(lesson, payload);
  } else {
    course.lessons.push(payload);
  }

  await course.save();
  res.json({ course });
});

export const addReview = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, "Course not found");

  const approvedAdmission = await Admission.findOne({
    selectedCourse: course._id,
    student: req.user._id,
    status: "Approved"
  });
  if (!approvedAdmission) throw new ApiError(403, "Admission approval is required before reviewing this course");

  const existingReview = course.reviews.find(
    (review) => review.student.toString() === req.user._id.toString()
  );

  if (existingReview) {
    existingReview.rating = req.body.rating;
    existingReview.comment = req.body.comment;
  } else {
    course.reviews.push({ student: req.user._id, rating: req.body.rating, comment: req.body.comment });
  }

  course.recalculateRating();
  await course.save();

  res.status(201).json({ course });
});
