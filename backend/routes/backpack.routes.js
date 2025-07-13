import express from "express";
import asyncHandler from "express-async-handler";
import auth from "../middleware/auth.js";
import {
  createBackpack,
  getBackpacks,
  getBackpackById,
  updateBackpack,
  deleteBackpack,
} from "../controllers/Backpack.controller.js";

const router = express.Router();

router.get("/", auth, asyncHandler(getBackpacks));
router.post("/", auth, asyncHandler(createBackpack));
router.get("/:id", auth, asyncHandler(getBackpackById));
router.put("/:id", auth, asyncHandler(updateBackpack));
router.delete("/:id", auth, asyncHandler(deleteBackpack));

export default router;
