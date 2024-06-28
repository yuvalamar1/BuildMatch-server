import express from "express";
import authRouter from "./routes/auth.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
dotenv.config();

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

// Middleware to parse JSON requests
app.use(express.json());
app.use("/auth", authRouter);

/////////////////////////////////////////////////////
app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.body);
  res.send("Hello");
});

/////////////////////////////////////////////////////

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })

  .catch((err) => console.log("Error connecting to MongoDB", err));
