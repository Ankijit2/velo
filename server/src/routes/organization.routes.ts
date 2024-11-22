import { createOrganization,updateOrganization,deleteOrganization,getPersonalOrganizations,getOrganizationById,getAvailableOrganizations,joinOrganization } from "../controllers/organization.controller.js";
import authenticateJWT from "../middlewares/auth.middleware.js";

import { Router } from "express";

const router = Router();


router.route("/").post(authenticateJWT,createOrganization)
router.route("/").get(authenticateJWT,getPersonalOrganizations);
router.route("/available").get(authenticateJWT,getAvailableOrganizations);
router.route("/join").post(authenticateJWT,joinOrganization);
router.route("/:id").get(authenticateJWT,getOrganizationById).put(authenticateJWT,updateOrganization).delete(authenticateJWT,deleteOrganization);

export default router