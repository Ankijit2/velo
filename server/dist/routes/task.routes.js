import { createTask, updateTask, deleteTask, getTask } from "../controllers/task.controller.js";
import { Router } from "express";
import authenticateJWT from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/:org_id").post(authenticateJWT, createTask);
router.route("/:org_id/:task_id").put(authenticateJWT, updateTask);
router.route("/:org_id/:task_id").delete(authenticateJWT, deleteTask);
router.route("/:org_id").get(authenticateJWT, getTask);
export default router;
