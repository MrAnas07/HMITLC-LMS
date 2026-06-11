import { Router } from "express";
import { contactRules, submitContact } from "../controllers/contact.controller.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.post("/", contactRules, validate, submitContact);

export default router;