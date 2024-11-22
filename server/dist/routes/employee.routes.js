import { addEmployee, getAllEmployees, deleteEmployee, updateStatus } from "../controllers/employee.controller.js";
import authenticateJWT from "../middlewares/auth.middleware.js";
import { Router } from "express";
const router = Router();
router.route("/").post(authenticateJWT, addEmployee);
router.route("/getAll/:org_id").get(authenticateJWT, getAllEmployees);
router.route("/:org_id/:employee_id").delete(authenticateJWT, deleteEmployee);
router.route("/:org_id/:employee_id").patch(authenticateJWT, updateStatus);
export default router;
