import express from "express";
import asyncHandler from "express-async-handler";
import auth from "../middleware/auth.js";
import {
  getCustomItems,
  createCustomItem,
  updateCustomItem,
  deleteCustomItem,
} from "../controllers/HealthCustomItem.controller.js";

const router = express.Router();

router.get("/", auth, asyncHandler(getCustomItems));
router.post("/", auth, asyncHandler(createCustomItem));
router.put("/:id", auth, asyncHandler(updateCustomItem));
router.delete("/:id", auth, asyncHandler(deleteCustomItem));

export default router;
