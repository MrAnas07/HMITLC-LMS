import { Router } from "express";
import { body } from "express-validator";
import {
  admissionListRules,
  admissionRules,
  createAdmission,
  decideAdmission,
  getMyAdmission,
  listAdmissions,
  verifyStudent,
  updateStudentStatus
} from "../controllers/admission.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { getWhatsAppStatus } from "../utils/whatsappService.js";

const router = Router();

router.get("/verify/:studentId", verifyStudent);

router.use(protect);

router.get("/whatsapp/status", authorize("admin"), (req, res) => {
  res.json(getWhatsAppStatus());
});

router.post("/whatsapp/reset", authorize("admin"), async (req, res) => {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const { fileURLToPath } = await import("url");
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const authFolder = path.join(__dirname, "../../whatsapp-auth");

    if (fs.existsSync(authFolder)) {
      fs.rmSync(authFolder, { recursive: true, force: true });
    }

    res.json({ success: true, message: "WhatsApp session reset. Restart server to get new QR." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/my", getMyAdmission);
router.post("/", authorize("student"), admissionRules, validate, createAdmission);
router.get("/", admissionListRules, validate, listAdmissions);
router.patch("/:id", authorize("teacher", "admin"), decideAdmission);
router.put("/:id/status", authorize("admin"), updateStudentStatus);

export default router;
