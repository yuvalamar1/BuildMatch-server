import express from "express";
import { getuser } from "../controllers/users.js";

const userrouter = express.Router();

userrouter.get("/getuser", getuser);

export default userrouter;
