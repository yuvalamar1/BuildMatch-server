import express from "express";
import { createplot, getplotsbyprojectid } from "../controllers/plots.js";

const plotrouter = express.Router();

plotrouter.post("/createplot", createplot);
plotrouter.get("/getplotsbyprojectid/:projectId", getplotsbyprojectid);

export default plotrouter;
