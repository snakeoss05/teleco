import express from "express";
import {
  getEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentById,
} from "../controllers/equipment.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getEquipment);
router.post("/", protect, createEquipment);
router.get("/:id", getEquipmentById);
router.put("/:id", protect, updateEquipment);
router.delete("/:id", protect, deleteEquipment);

export default router;
