import express from "express";
import { verifyToken } from "../middlewares/VerifyToken.js";
import {
  deleteUserManagement,
  getUserManagement,
  getUserManagementById,
  saveUserManagement,
  updateUserManagement,
} from "../controllers/UserManagementController.js";

const router = express.Router();

router.get("/userManagements", verifyToken, getUserManagement);
router.get("/getUserManagement/:id", verifyToken, getUserManagementById);
router.post("/userManagement", verifyToken, saveUserManagement);
router.put("/editUserManagement/:id", verifyToken, updateUserManagement);
router.delete("/hapusUserManagement/:id", verifyToken, deleteUserManagement);

export default router;
