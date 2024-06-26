import express from "express";
import authRouter from "./routes/auth.js";
import mongoose from "mongoose";
import cors from "cors";
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use("/auth", authRouter);

// Basic route to handle GET requests to the root URL
// app.get("/", (req, res) => {
//   res.send("this is buildmatch backendd");
// });

// // Another route to handle GET requests to /about
// app.get("/about", (req, res) => {
//   res.send("About Page");
//   console.log("About Page");
// });

// // Route to handle POST requests to /data
// app.post("/data", (req, res) => {
//   const data = req.body;
//   res.send(`You sent: ${JSON.stringify(data)}`);
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
