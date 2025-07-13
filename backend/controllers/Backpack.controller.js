import Backpack from "../models/Backpack.model.js";

export const createBackpack = async (req, res) => {
  try {
    const backpack = new Backpack(req.body);
    await backpack.save();
    res.status(201).json(backpack);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getBackpacks = async (req, res) => {
  try {
    const backpacks = await Backpack.find();
    res.json(backpacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBackpackById = async (req, res) => {
  try {
    const backpack = await Backpack.findById(req.params.id);
    if (!backpack) return res.status(404).json({ error: "Backpack not found" });
    res.json(backpack);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBackpack = async (req, res) => {
  try {
    const backpack = await Backpack.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!backpack) return res.status(404).json({ error: "Backpack not found" });
    res.json(backpack);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteBackpack = async (req, res) => {
  try {
    const backpack = await Backpack.findByIdAndDelete(req.params.id);
    if (!backpack) return res.status(404).json({ error: "Backpack not found" });
    res.json({ message: "Backpack deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
