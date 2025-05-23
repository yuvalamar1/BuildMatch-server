import express from "express";
import authRouter from "./routes/auth.js";
import projectrouter from "./routes/projects.js";
import userRouter from "./routes/users.js";
import plotrouter from "./routes/plots.js";
import preferencerouter from "./routes/preferencelist.js";
import { firstcheck, getDailyCheck } from "./services/dailycheck.js";
import dotenv from "dotenv";
import mongoose, { get } from "mongoose";
import cors from "cors";
import multer from "multer";
import cron from "node-cron";

const app = express();
app.use(cors());
dotenv.config();
const PORT = process.env.PORT || 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
app.use("/uploads", express.static("uploads"));

// Middleware to parse JSON requests
app.use(express.json());
app.use("/auth", authRouter);
app.use("/projects", projectrouter);
app.use("/users", userRouter);
app.use("/plots", plotrouter);
app.use("/preferences", preferencerouter);

// Schedule the cron job to run at 00:01 every day

cron.schedule("05 00 * * *", () => {
  try {
    console.log("Running the daily check");
    getDailyCheck();
  } catch (err) {
    console.log(err);
  }
});

app.get("/dailycheck", getDailyCheck);

app.get("/keepalive", (req, res) => {
  res.status(200).json("Server is alive");
  firstcheck();
});

/////////////////////////////////////////////////////
app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req);
  console.log(req.file.path);
  res.send(req.file.path);
});

/////////////////////////////////////////////////////

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on render or in http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log("Error connecting to MongoDB", err));
