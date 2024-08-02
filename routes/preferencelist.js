import express from "express";
import {
  getprojetpreferences,
  createpreference,
} from "../controllers/preferencelist.js";

const preferencerouter = express.Router();

preferencerouter.get(
  "/getpreference/:projectId/:clientid",
  getprojetpreferences
);
preferencerouter.post("/createpreference", createpreference);

export default preferencerouter;
