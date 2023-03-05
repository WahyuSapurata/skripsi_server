import express from "express";
import { verifyToken } from "../middlewares/VerifyToken.js";
import {
  addJurnal,
  deleteJurnal,
  getJurnal,
  getJurnalById,
  updateJurnal,
} from "../controllers/JurnalController.js";

const router = express.Router();

router.get("/getJurnal", verifyToken, getJurnal);
router.get("/getJurnalById/:id", verifyToken, getJurnalById);
router.post("/addJurnal", verifyToken, addJurnal);
router.put("/updateJurnal/:id", verifyToken, updateJurnal);
router.delete("/deleteJurnal/:id", verifyToken, deleteJurnal);

export default router;
