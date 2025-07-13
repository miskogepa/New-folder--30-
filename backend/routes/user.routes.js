import express from "express";
import asyncHandler from "express-async-handler";
import auth from "../middleware/auth.js";
import {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/User.controller.js";

const router = express.Router();

router.get("/", asyncHandler(getUsers));
router.post("/", asyncHandler(createUser));
router.post("/login", asyncHandler(loginUser));
router.get("/:id", auth, asyncHandler(getUserById));
router.put("/:id", auth, asyncHandler(updateUser));
router.delete("/:id", auth, asyncHandler(deleteUser));

export default router;
