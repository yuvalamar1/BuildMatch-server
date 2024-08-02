import express from "express";
import {
  getprojetpreferences,
  createpreference,
  getsubmittedproject,
} from "../controllers/preferencelist.js";

const preferencerouter = express.Router();

preferencerouter.get(
  "/getpreference/:projectId/:clientid",
  getprojetpreferences
);
preferencerouter.post("/createpreference", createpreference);
preferencerouter.get("/getsubmittedprojects/:clientid", getsubmittedproject);

export default preferencerouter;
