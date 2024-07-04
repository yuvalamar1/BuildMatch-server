import express from "express";
import { createproject, getAllProjects } from "../controllers/projects.js";

const projectrouter = express.Router();

projectrouter.post("/createproject", createproject);
projectrouter.get("/getallprojects", getAllProjects);

export default projectrouter;
