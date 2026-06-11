import { Router } from "express";
import { dashboardStats, listUsers } from "../controllers/user.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/dashboard", dashboardStats);
router.get("/", authorize("admin"), listUsers);

export default router;
