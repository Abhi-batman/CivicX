import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MIDDLEWARES
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve frontend folder correctly
app.use(express.static(path.join(__dirname, "../../webfrontend")));

// ROUTES
import userRouter from "./routers/user.router.js";
import reportRouter from "./routers/report.router.js";
import authorityRouter from "./routers/authority.router.js";
import csrRouter from "./routers/csr.router.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/report", reportRouter);
app.use("/api/v1/authority", authorityRouter);
app.use("/api/v1/csr", csrRouter);


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../webfrontend/authority.html"));
});




export { app };
