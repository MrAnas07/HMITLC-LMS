import { upload } from "../config/cloudinary.js";

export default upload;
export { upload };

export const uploadSingle = upload.single("profilePicture");
export const uploadFields = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]);

export const getFileUrl = (req, file) => {
  if (!file) return undefined;
  if (file.path?.startsWith("http")) return file.path;
  return `${req.protocol}://${req.get("host")}/${file.path.replaceAll("\\", "/")}`;
};
