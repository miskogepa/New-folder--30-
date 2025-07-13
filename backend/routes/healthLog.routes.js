import express from "express";
import asyncHandler from "express-async-handler";
import auth from "../middleware/auth.js";
import {
  upsertHealthLog,
  getHealthLogForUserAndDate,
  getHealthLogs,
  getHealthLogById,
  updateHealthLog,
  deleteHealthLog,
} from "../controllers/HealthLog.controller.js";

const router = express.Router();

router.get("/", auth, asyncHandler(getHealthLogForUserAndDate));
router.post("/", auth, asyncHandler(upsertHealthLog));
router.get("/all", auth, asyncHandler(getHealthLogs)); // za admina
router.get("/:id", auth, asyncHandler(getHealthLogById));
router.put("/:id", auth, asyncHandler(updateHealthLog));
router.delete("/:id", auth, asyncHandler(deleteHealthLog));

export default router;
