import express from "express";
import {
  login,
  registeradministator,
  registerclient,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register/administrator", registeradministator);
router.post("/register/client", registerclient);

export default router;
