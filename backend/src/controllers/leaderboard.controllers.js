// controllers/leaderboard.controller.js
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Report } from "../models/report.model.js";
import { User } from "../models/user.model.js";
import { Csr } from "../models/csr.model.js";

/**
 * GET /leaderboard/citizens?limit=10&offset=0&sort=points
 * Default: sort by Points desc. Alternative: ?sort=reports
 */
export const getCitizenLeaderboard = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 10), 200);
  const offset = Math.max(0, Number(req.query.offset || 0));
  const sort = (req.query.sort || "points").toLowerCase(); // 'points' or 'reports'

  // Aggregate: group reports by reportedBy to get totalReports
  const pipeline = [
    {
      $group: {
        _id: "$reportedBy",
        totalReports: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        userId: "$_id",
        fullname: "$user.fullname",
        avatarUrl: "$user.profilePhoto.url",
        points: { $ifNull: ["$user.Points", 0] },
        totalReports: 1,
        lastActive: "$user.updatedAt",
      },
    },
    {
      $sort:
        sort === "reports"
          ? { totalReports: -1, points: -1 }
          : { points: -1, totalReports: -1 },
    },
    { $skip: offset },
    { $limit: limit },
  ];

  const rows = await Report.aggregate(pipeline);

  const result = rows.map((r) => ({
    userId: r.userId,
    name: r.fullname,
    avatarUrl: r.avatarUrl,
    points: r.points,
    totalReports: r.totalReports,
    lastActive: r.lastActive,
  }));

  // total distinct reporting users (for pagination / front-end)
  const totalUsersAgg = await Report.aggregate([
    { $group: { _id: "$reportedBy" } },
    { $count: "totalUsers" },
  ]);
  const total = totalUsersAgg[0] ? totalUsersAgg[0].totalUsers : 0;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { total, offset, limit, rows: result },
        "Citizen leaderboard"
      )
    );
});

export const getCitizenList = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 50), 500);
  const offset = Math.max(0, Number(req.query.offset || 0));
  const sort = (req.query.sort || "reports").toLowerCase(); // 'reports'|'points'

  // same pipeline as leaderboard but supports larger page sizes
  const pipelineBase = [
    {
      $group: {
        _id: "$reportedBy",
        totalReports: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        userId: "$_id",
        fullname: "$user.fullname",
        avatarUrl: "$user.profilePhoto.url",
        points: { $ifNull: ["$user.Points", 0] },
        totalReports: 1,
        lastActive: "$user.updatedAt",
      },
    },
  ];

  const sortStage =
    sort === "points"
      ? { $sort: { points: -1, totalReports: -1 } }
      : { $sort: { totalReports: -1, points: -1 } };

  const pipeline = [
    ...pipelineBase,
    sortStage,
    { $skip: offset },
    { $limit: limit },
  ];

  const [rows, totalAgg] = await Promise.all([
    Report.aggregate(pipeline),
    Report.aggregate([
      { $group: { _id: "$reportedBy" } },
      { $count: "totalUsers" },
    ]),
  ]);

  const total = totalAgg[0] ? totalAgg[0].totalUsers : 0;

  if (!total) throw new ApiError(500, "Error");

  const result = rows.map((r) => ({
    userId: r.userId,
    name: r.fullname,
    avatarUrl: r.avatarUrl,
    points: r.points,
    totalReports: r.totalReports,
    lastActive: r.lastActive,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { total, offset, limit, rows: result },
        "Citizen list"
      )
    );
});

export const getCsrLeaderboard = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 10), 100);

  const csrs = await Csr.aggregate([
    {
      $addFields: {
        csrScore: {
          $add: [
            { $multiply: [{ $ifNull: ["$totalDonations", 0] }, 0.6] },
            { $multiply: [{ $ifNull: ["$problemsSponsored", 0] }, 100] },
          ],
        },
      },
    },
    { $sort: { csrScore: -1, totalDonations: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        companyName: 1,
        logoUrl: 1,
        totalDonations: 1,
        problemsSponsored: 1,
        lastDonation: 1,
        csrScore: 1,
      },
    },
  ]);

  return res.status(200).json(new ApiResponse(200, csrs, "CSR leaderboard"));
});

export default {
  getCitizenLeaderboard,
  getCitizenList,
  getCsrLeaderboard,
};
