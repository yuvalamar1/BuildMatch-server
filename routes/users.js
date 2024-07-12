import express from "express";
import { getuser, updateuser } from "../controllers/users.js";

const userrouter = express.Router();

userrouter.get("/getuser", getuser);
userrouter.put("/updateuser", updateuser);

export default userrouter;
