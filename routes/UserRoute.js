import express from "express";
import {
  getUser,
  login,
  logout,
  registerUser,
} from "../controllers/UserController.js";
import { refreshToken } from "../middlewares/RefreshToken.js";
import { verifyToken } from "../middlewares/VerifyToken.js";

const router = express.Router();

router.get("/user", verifyToken, getUser);
router.post("/add_user", registerUser);
router.post("/login", login);
router.get("/token", refreshToken);
router.delete("/logout", logout);

export default router;
