import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { authorityLogin, getReportedIssues, markReportResolved, releaseTender } from "../controllers/authority.controller.js";

const router = Router()

router.post("/login", authorityLogin);


router.get("/issues", verifyJWT, getReportedIssues);


router.patch("/issues/:reportId/resolve", verifyJWT, markReportResolved);

router.post("/issues/:reportId/release-tender", verifyJWT, releaseTender);


export default router;
