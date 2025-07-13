import express from "express";
import asyncHandler from "express-async-handler";
import auth from "../middleware/auth.js";
import {
  createItemUsage,
  getItemUsages,
  getItemUsageById,
  updateItemUsage,
  deleteItemUsage,
} from "../controllers/ItemUsage.controller.js";

const router = express.Router();

router.get("/", auth, asyncHandler(getItemUsages));
router.post("/", auth, asyncHandler(createItemUsage));
router.get("/:id", auth, asyncHandler(getItemUsageById));
router.put("/:id", auth, asyncHandler(updateItemUsage));
router.delete("/:id", auth, asyncHandler(deleteItemUsage));

export default router;
