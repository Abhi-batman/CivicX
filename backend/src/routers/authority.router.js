import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { authorityLogin, getReportedIssues, markReportResolved, releaseTender, registerAuthority } from "../controllers/authority.controller.js";

const router = Router()

router.post("/login", authorityLogin);
router.post("/register", registerAuthority)

router.get("/issues", verifyJWT, getReportedIssues);


router.patch("/issues/:reportId/resolve", verifyJWT, markReportResolved);

router.post("/issues/:reportId/release-tender", verifyJWT, releaseTender);


export default router;
