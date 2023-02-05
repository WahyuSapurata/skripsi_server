import express from "express";
import {
  getUser,
  getUserById,
  login,
  logout,
  registerUser,
  updateUser,
} from "../controllers/UserController.js";
import { refreshToken } from "../middlewares/RefreshToken.js";
import { verifyToken } from "../middlewares/VerifyToken.js";

const router = express.Router();

router.get("/users", verifyToken, getUser);
router.get("/users/:id", verifyToken, getUserById);
router.post("/add_user", registerUser);
router.post("/login", login);
router.get("/token", refreshToken);
router.put("/users/:id", verifyToken, updateUser);
router.delete("/logout", logout);

export default router;
