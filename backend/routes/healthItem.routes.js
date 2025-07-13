import express from "express";
import asyncHandler from "express-async-handler";
import auth from "../middleware/auth.js";
import {
  createHealthItem,
  getHealthItems,
  getHealthItemById,
  updateHealthItem,
  deleteHealthItem,
  updateHealthItemOrder,
} from "../controllers/HealthItem.controller.js";

const router = express.Router();

router.get("/", auth, asyncHandler(getHealthItems));
router.post("/", auth, asyncHandler(createHealthItem));
router.get("/:id", auth, asyncHandler(getHealthItemById));
router.put("/:id", auth, asyncHandler(updateHealthItem));
router.delete("/:id", auth, asyncHandler(deleteHealthItem));
router.put("/order/update", auth, asyncHandler(updateHealthItemOrder));

export default router;
