import express from "express";
import asyncHandler from "express-async-handler";
import auth from "../middleware/auth.js";
import {
  createHealthLog,
  getHealthLogs,
  getHealthLogById,
  updateHealthLog,
  deleteHealthLog,
} from "../controllers/HealthLog.controller.js";

const router = express.Router();

router.get("/", auth, asyncHandler(getHealthLogs));
router.post("/", auth, asyncHandler(createHealthLog));
router.get("/:id", auth, asyncHandler(getHealthLogById));
router.put("/:id", auth, asyncHandler(updateHealthLog));
router.delete("/:id", auth, asyncHandler(deleteHealthLog));

export default router;
