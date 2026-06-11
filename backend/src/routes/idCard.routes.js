import { Router } from "express";
import { getIdCard, idCardRules } from "../controllers/idCard.controller.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

// Public endpoint - search by CNIC
router.get("/search", idCardRules, validate, getIdCard);

export default router;