import { Authority } from "../models/authority .model.js";
import { Report } from "../models/report.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const registerAuthority = asyncHandler(async (req, res) => {
  const { name, email, password, designation, category } = req.body;


  if (!name || !email || !password || !designation || !category)
    throw new ApiError(400, "All fields are required");

  
  const existingAuthority = await Authority.findOne({ email });
  if (existingAuthority)
    throw new ApiError(409, "Authority with this email already exists");


  const authority = await Authority.create({
    name,
    email,
    password,
    designation,
    category,
  });

  
  const accessToken = authority.generateAccessToken();

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { authority, accessToken },
        "Authority registered successfully"
      )
    );
});

const authorityLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ApiError(400, "Email and password required");

  const authority = await Authority.findOne({ email });

  if (!authority) throw new ApiError(404, "Authority not found");

  const isPasswordValid = await bcrypt.compare(password, authority.password);

  if (!isPasswordValid) throw new ApiError(401, "Invalid password");

  const accessToken = jwt.sign(
    { id: authority._id, email: authority.email, name: authority.name },
    process.env.AUTHORITY_ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { authority, accessToken },
        "Authority logged in successfully"
      )
    );
});

const getReportedIssues = asyncHandler(async (req, res) => {
  const reports = await Report.find()
    .populate("reportedBy", "fullname username profilePhoto")
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(
      new ApiResponse(200, reports, "Reported issues fetched successfully")
    );
});

const markReportResolved = asyncHandler(async (req, res) => {
  const { reportId } = req.body;

  if (!reportId) throw new ApiError(400, "Report ID is required");

  const report = await Report.findByIdAndUpdate(
    reportId,
    { $set: { status: "resolved" } },
    { new: true }
  );

  if (!report) throw new ApiError(404, "Report not found");

  await User.findByIdAndUpdate(report.reportedBy, {
    $inc: { points: 5 },
  });

  if (!report) throw new ApiError(404, "Report not found");

  return res
    .status(200)
    .json(new ApiResponse(200, report, "Report marked as resolved"));
});

const releaseTender = asyncHandler(async (req, res) => {
  const { reportId, tenderDetails } = req.body;

  if (!reportId || !tenderDetails)
    throw new ApiError(400, "Report ID and tender details required");

  const report = await Report.findById(reportId);

  if (!report) throw new ApiError(404, "Report not found");

  report.tender = {
    details: tenderDetails,
    releasedBy: req.authority._id,
    releasedAt: new Date(),
    acceptedBy: null,
  };

  await report.save();

  return res
    .status(200)
    .json(new ApiResponse(200, report, "Tender released successfully"));
});

export { authorityLogin, getReportedIssues, markReportResolved, releaseTender, registerAuthority  };
