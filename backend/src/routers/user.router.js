import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updatePassword,
  updateProfile,
  updateProfilePhoto,
  getUser,
  getReport,
} from "../controllers/user.controller.js"


const router = Router();

router.route("/register").post(
    upload.single(
       "profilePhoto"
    ),
    registerUser
)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT,  logoutUser)

router.route("/change-password").patch(verifyJWT, updatePassword)
router.route("/update-profile").patch(verifyJWT, updateProfile)
router.route("/c/:username").get(verifyJWT,getReport)
router.route("/current-user").get(verifyJWT,getUser)

router.route("/profile-photo").patch(verifyJWT, upload.single("profilePhoto"), updateProfilePhoto)

export default router