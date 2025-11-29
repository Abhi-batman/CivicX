import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  csrLogin,
  getReleasedTenders,
  acceptTenderRequest,
} from "../controllers/csr.controller.js";
const router = Router()
router.post("/login", csrLogin);


router.get("/tenders", verifyJWT, getReleasedTenders);


router.post("/tenders/:tenderId/accept", verifyJWT, acceptTenderRequest);


export default router;
