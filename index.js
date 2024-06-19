// index.js

import express from "express";
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Basic route to handle GET requests to the root URL
app.get("/", (req, res) => {
  res.send("this is buildmatch backend");
});

// Another route to handle GET requests to /about
app.get("/about", (req, res) => {
  res.send("About Page");
  console.log("About Page");
});

// Route to handle POST requests to /data
app.post("/data", (req, res) => {
  const data = req.body;
  res.send(`You sent: ${JSON.stringify(data)}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
