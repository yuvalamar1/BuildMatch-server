import express from "express";
import {
  getuser,
  updateuser,
  getadministratornamebyid,
} from "../controllers/users.js";

const userrouter = express.Router();

userrouter.get("/getuser", getuser);
userrouter.put("/updateuser", updateuser);
userrouter.get(`/getcompanynamebyid/:id`, getadministratornamebyid);

export default userrouter;
