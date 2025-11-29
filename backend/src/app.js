import express from "express";
import { User } from "./models/user.model.js";

import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, "../../frontend")));

// Send index.html on root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/index.html"));
});

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());

// importing the routes

import userRouter from "./routers/user.router.js";
import reportRouter from "./routers/report.router.js";
import authorityRouter from "./routers/authority.router"
import csrRouter from "./routers/csr.router.js"

app.use("/api/v1/users", userRouter);
app.use("/api/v1/report", reportRouter);
app.use("/api/v1/authority",authorityRouter )
app.use("/api/v1/csr", csrRouter)

export { app };
