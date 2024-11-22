import { getUser } from "../controllers/user.controller.js";

import { Router } from "express";

const router = Router();

router.route("/non-org/:org_id").get(getUser);
router.route("/").get(
    async function (req, res) {
        res.send("hello");
    }
);


export default router