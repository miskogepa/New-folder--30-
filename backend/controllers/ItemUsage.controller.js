import ItemUsage from "../models/ItemUsage.model.js";

export const createItemUsage = async (req, res) => {
  try {
    const usage = new ItemUsage(req.body);
    await usage.save();
    res.status(201).json(usage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getItemUsages = async (req, res) => {
  try {
    const usages = await ItemUsage.find();
    res.json(usages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getItemUsageById = async (req, res) => {
  try {
    const usage = await ItemUsage.findById(req.params.id);
    if (!usage) return res.status(404).json({ error: "ItemUsage not found" });
    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateItemUsage = async (req, res) => {
  try {
    const usage = await ItemUsage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!usage) return res.status(404).json({ error: "ItemUsage not found" });
    res.json(usage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteItemUsage = async (req, res) => {
  try {
    const usage = await ItemUsage.findByIdAndDelete(req.params.id);
    if (!usage) return res.status(404).json({ error: "ItemUsage not found" });
    res.json({ message: "ItemUsage deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
