import express from "express";
import { createproject } from "../controllers/projects.js";

const projectrouter = express.Router();

projectrouter.post("/createproject", createproject);

export default projectrouter;
