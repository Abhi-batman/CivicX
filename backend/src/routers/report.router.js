import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  submitReport,
  updateDescription,
  deleteReport,
  getAllReport,
  getReportbyId,
} from "../controllers/report.controller.js";

const router = Router();

router
  .route("/submitReport")
  .post(verifyJWT, upload.single("image"), submitReport);
router.route("/deleteReport/:id").delete(verifyJWT, deleteReport);
router.route("/updateDescription/:id").patch(verifyJWT, updateDescription);
router.route("/getReport/:id").get(verifyJWT, getReportbyId);
router.route("/getAllReports").get(getAllReport);

export default router;
