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
router.post("/", createEquipment);
router.get("/:id", getEquipmentById);
router.put("/:id", updateEquipment);
router.delete("/:id", deleteEquipment);

export default router;
