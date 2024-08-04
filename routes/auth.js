import express from "express";
import {
  login,
  registeradministator,
  registerclient,
  restpassword,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register/administrator", registeradministator);
router.post("/register/client", registerclient);
router.post("/resetpassword", restpassword);

export default router;
