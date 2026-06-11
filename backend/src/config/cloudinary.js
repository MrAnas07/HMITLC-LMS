import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const videoTypes = ["video/mp4", "video/quicktime"];
const documentTypes = ["application/pdf"];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    const extension = path.extname(file.originalname).replace(".", "").toLowerCase();
    const isImage = imageTypes.includes(file.mimetype);
    const isVideo = videoTypes.includes(file.mimetype);
    const isDocument = documentTypes.includes(file.mimetype);

    return {
      folder: isImage ? "hmitlc/images" : isVideo ? "hmitlc/videos" : "hmitlc/resources",
      resource_type: isVideo ? "video" : isDocument ? "raw" : "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mov", "pdf"],
      public_id: `${file.fieldname}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      format: extension || undefined,
      ...(isImage && {
        transformation: [{ width: 1200, height: 1200, crop: "limit", quality: "auto" }]
      })
    };
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [...imageTypes, ...videoTypes, ...documentTypes];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images, videos, and PDF files are allowed"), false);
    }
  }
});

export { cloudinary, upload };
export default upload;
