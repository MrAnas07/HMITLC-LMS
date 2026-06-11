import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, trim: true, maxlength: 500 },
    icon: { type: String, default: "Code" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

categorySchema.pre("validate", function setSlug(next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("Category", categorySchema);
