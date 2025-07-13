import HealthCustomItem from "../models/HealthCustomItem.model.js";
import mongoose from "mongoose";

export const getCustomItems = async (req, res) => {
  try {
    console.log("[getCustomItems] req.user:", req.user);
    console.log("[getCustomItems] userId:", req.user?.id);

    if (!req.user?.id) {
      return res.status(400).json({ error: "Nedostaje userId u tokenu" });
    }

    const items = await HealthCustomItem.find({
      userId: req.user.id,
    });
    console.log("[getCustomItems] found items:", items);
    res.json(items);
  } catch (error) {
    console.error("[getCustomItems] error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createCustomItem = async (req, res) => {
  try {
    console.log("[createCustomItem] userId:", req.user?.id, "body:", req.body);
    const { label, iconId, limit } = req.body;
    if (!label || !iconId || !limit) {
      return res
        .status(400)
        .json({ error: "label, iconId i limit su obavezni" });
    }
    if (!req.user?.id) {
      return res.status(400).json({ error: "Nedostaje userId u tokenu" });
    }
    const item = new HealthCustomItem({
      userId: req.user.id,
      label,
      iconId,
      limit,
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error("[createCustomItem] error:", error);
    res.status(400).json({ error: error.message });
  }
};

export const updateCustomItem = async (req, res) => {
  try {
    console.log("[updateCustomItem] userId:", req.user?.id, "body:", req.body);
    const { label, iconId, limit } = req.body;
    const item = await HealthCustomItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { label, iconId, limit },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (error) {
    console.error("[updateCustomItem] error:", error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteCustomItem = async (req, res) => {
  try {
    console.log(
      "[deleteCustomItem] userId:",
      req.user?.id,
      "params:",
      req.params
    );
    const item = await HealthCustomItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("[deleteCustomItem] error:", error);
    res.status(500).json({ error: error.message });
  }
};
