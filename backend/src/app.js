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
import { connectDatabase } from "./config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDatabase().catch((err) => {
  console.error("MongoDB connection failed:", err.message);
});

// CORS - MUST be first
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://hmitlc-lms.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
  maxAge: 86400
}));

// Preflight requests
app.options("*", cors());

// Helmet - after CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(compression());
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
