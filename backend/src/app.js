import compression from "compression";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import xss from "xss-clean";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import admissionRoutes from "./routes/admission.routes.js";
import userRoutes from "./routes/user.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import idCardRoutes from "./routes/idCard.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", process.env.CLIENT_URL || "http://localhost:5173"],
      mediaSrc: ["'self'", "blob:", "mediastream:"],
    }
  }
}));
app.use(compression());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(mongoSanitize());
app.use(xss());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "it-lms-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/id-card", idCardRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/quiz", quizRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
