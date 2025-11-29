import { Report } from "../models/report.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getPendingReportsOlderThanMonth = asyncHandler(async (req, res) => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const reports = await Report.find({
    status: "pending",
    createdAt: { $lte: oneMonthAgo },
  })
    .populate("reportedBy", "fullname username profilePhoto")
    .sort({ createdAt: -1 });

  if (!reports.length) {
    throw new ApiError(404, "No pending reports older than one month found");
  }

  return res.status(200).json(
    new ApiResponse(200, reports, "Pending reports older than one month fetched successfully")
  );
});

export const {getPendingReportsOlderThanMonth}