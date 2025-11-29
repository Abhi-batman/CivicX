import { Csr } from "../models/csr.model.js";
import { Report } from "../models/report.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const csrLogin = asyncHandler(async (req, res) => {
  const { companyEmail, password } = req.body;

  if (!companyEmail || !password)
    throw new ApiError(400, "Email and password required");

  const csr = await Csr.findOne({ companyEmail });

  if (!csr) throw new ApiError(404, "Company not found");

  const isPasswordValid = await bcrypt.compare(password, csr.password);

  if (!isPasswordValid) throw new ApiError(401, "Invalid password");

  const accessToken = jwt.sign(
    {
      id: csr._id,
      companyEmail: csr.companyEmail,
      companyName: csr.companyName,
    },
    process.env.CSR_ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { csr, accessToken },
        "Company logged in successfully"
      )
    );
});

// View all released tenders
const getReleasedTenders = asyncHandler(async (req, res) => {
  const tenders = await Report.find({
    "tender.releasedBy": { $exists: true },
    "tender.acceptedBy": null,
  });
  return res
    .status(200)
    .json(
      new ApiResponse(200, tenders, "Released tenders fetched successfully")
    );
});

// Send request to accept a tender
const acceptTenderRequest = asyncHandler(async (req, res) => {
  const { reportId } = req.body;

  if (!reportId) throw new ApiError(400, "Report ID is required");

  const report = await Report.findById(reportId);

  if (!report || !report.tender)
    throw new ApiError(404, "Tender not found for this report");

  if (report.tender.acceptedBy)
    throw new ApiError(400, "Tender already accepted");

  report.tender.acceptedBy = req.csr._id;
  report.tender.acceptedAt = new Date();

  await report.save();

  return res
    .status(200)
    .json(new ApiResponse(200, report, "Tender request accepted successfully"));
});

export { csrLogin, getReleasedTenders, acceptTenderRequest };
