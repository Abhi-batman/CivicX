import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";
import { Authority } from "../models/authority.model.js"; // <-- IMPORTANT
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Try finding User
    let account = await User.findById(decoded.id).select(
      "-password -refreshToken"
    );

    // If not User, try Authority
    if (!account) {
      account = await Authority.findById(decoded.id).select("-password");
    }

    if (!account) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = account;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
