import { Shorts } from "../models/shorts.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const uploadShorts = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if ([title, description].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "Title and description are required");
  }

  const videoPath = req.file?.path;
  if (!videoPath) throw new ApiError(400, "Video file is required");

  
  const uploadedVideo = await uploadOnCloudinary(videoPath);

  if (!uploadedVideo) {
    throw new ApiError(500, "Video upload failed");
  }

  const shorts = await Shorts.create({
    title,
    description,
    video: {
      url: uploadedVideo.secure_url,
      public_id: uploadedVideo.public_id,
    },
    postedBy: req.user._id,
  });

  if (!shorts) {
    throw new ApiError(500, "Failed to upload shorts");
  }

  await User.findByIdAndUpdate(req.user._id, {
    $push: { shorts: shorts._id },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, shorts, "Shorts uploaded successfully"));
});


const shareShorts = asyncHandler(async (req, res) => {
  const { shortsId } = req.params;

  if (!mongoose.isValidObjectId(shortsId)) {
    throw new ApiError(400, "Invalid shorts ID");
  }

  const shorts = await Shorts.findById(shortsId);

  if (!shorts) throw new ApiError(404, "Shorts not found");

  shorts.shares += 1;
  await shorts.save();

  return res
    .status(200)
    .json(new ApiResponse(200, shorts, "Shorts shared successfully"));
});


const deleteShorts = asyncHandler(async (req, res) => {
  const { shortsId } = req.params;

  if (!mongoose.isValidObjectId(shortsId)) {
    throw new ApiError(400, "Invalid shorts ID");
  }

  const shorts = await Shorts.findById(shortsId);

  if (!shorts) throw new ApiError(404, "Shorts not found");

  if (shorts.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this shorts");
  }

  
  if (shorts.video?.public_id) {
    try {
      await cloudinary.uploader.destroy(shorts.video.public_id, {
        resource_type: "video",
      });
    } catch (error) {
      console.log("Error deleting video from cloudinary:", error);
    }
  }

  await Shorts.findByIdAndDelete(shortsId);

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { shorts: shortsId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Shorts deleted successfully"));
});

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getShorts = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  const shortsData = await User.aggregate([
   
    {
      $match: {
        username: { $regex: `^${username}$`, $options: "i" },
      },
    },

   
    {
      $lookup: {
        from: "shorts",
        localField: "_id",
        foreignField: "postedBy",
        as: "shorts",
      },
    },

    {
      $addFields: {
        shortsCount: { $size: "$shorts" },
      },
    },

    
    {
      $project: {
        fullName: 1,
        username: 1,
        profilePhoto: 1,
        email: 1,
        shortsCount: 1,
        shorts: 1,
      },
    },
  ]);

  if (!shortsData?.length) {
    throw new ApiError(404, "User or Shorts not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, shortsData[0], "Shorts fetched successfully"));
});

export { getShorts };


export { uploadShorts, shareShorts, deleteShorts, getShorts };


