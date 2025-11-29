import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/createReport")
  .post(verifyJwt, upload.single("image"), createPost);
router.route("/deletePost/:id").delete(verifyJwt, deletePost);
router.route("/updatePost/:id").patch(verifyJwt, updatePost);
router.route("/getPost/:id").get(verifyJwt, getPostbyId);
router.route("/getAllPosts").get(getAllPosts);

export default router;
