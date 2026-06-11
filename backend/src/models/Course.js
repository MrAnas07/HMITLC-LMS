import mongoose from "mongoose";
import slugify from "slugify";

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, default: 0 },
    videoUrl: String,
    resourceUrl: String,
    isPreview: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const reviewSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 600 }
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true
    },
    level: {
      type: String,
      default: "Beginner"
    },
    price: { type: String, default: "0" },
    duration: { type: String, default: "12 weeks", trim: true },
    weeklyHours: { type: String, default: "4 hours", trim: true },
    prerequisites: {
      type: String,
      default: "No prerequisites. Open to beginners who can use phones and computers.",
      trim: true
    },
    learningOutcomes: [{ type: String, trim: true }],
    courseOutline: [
      {
        title: { type: String, trim: true },
        topics: [{ type: String, trim: true }]
      }
    ],
    thumbnailUrl: String,
    introVideoUrl: String,
    resources: [
      {
        title: String,
        fileUrl: String,
        fileType: String
      }
    ],
    lessons: [lessonSchema],
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPublished: { type: Boolean, default: false },
    certificateEnabled: { type: Boolean, default: true },
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    applicationCount: { type: Number, default: 0 },
    totalSeats: { type: Number, default: 40, min: 1 },
    seatsAvailable: { type: Number, default: 40, min: 0 },
    seatsBooked: { type: Number, default: 0 }
  },
  { timestamps: true }
);

courseSchema.pre("validate", function setSlug(next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

courseSchema.methods.recalculateRating = function recalculateRating() {
  if (!this.reviews.length) {
    this.averageRating = 0;
    return;
  }

  this.averageRating =
    this.reviews.reduce((sum, review) => sum + review.rating, 0) / this.reviews.length;
};

export default mongoose.model("Course", courseSchema);
