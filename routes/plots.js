import express from "express";
import { createplot } from "../controllers/plots.js";

const plotrouter = express.Router();

plotrouter.post("/createplot", createplot);

export default plotrouter;