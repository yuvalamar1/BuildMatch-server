import express from "express";
import authRouter from "./routes/auth.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
dotenv.config();

// Middleware to parse JSON requests
app.use(express.json());
app.use("/auth", authRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })

  .catch((err) => console.log("Error connecting to MongoDB", err));
