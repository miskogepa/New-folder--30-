import express from "express";
import asyncHandler from "express-async-handler";
import auth from "../middleware/auth.js";
import {
  createEdcItem,
  getEdcItems,
  getEdcItemById,
  updateEdcItem,
  deleteEdcItem,
} from "../controllers/EdcItem.controller.js";

const router = express.Router();

router.get("/", auth, asyncHandler(getEdcItems));
router.post("/", auth, asyncHandler(createEdcItem));
router.get("/:id", auth, asyncHandler(getEdcItemById));
router.put("/:id", auth, asyncHandler(updateEdcItem));
router.delete("/:id", auth, asyncHandler(deleteEdcItem));

export default router;
