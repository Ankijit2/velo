import { assignAdmin, removeAdmin } from "../controllers/admin.controller.js";
import { Router } from "express";
import authenticateJWT from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/assign").post(authenticateJWT, assignAdmin);
router.route("/remove").post(authenticateJWT, removeAdmin);
export default router;
