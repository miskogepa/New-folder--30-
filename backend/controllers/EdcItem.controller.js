import EdcItem from "../models/EdcItem.model.js";

export const createEdcItem = async (req, res) => {
  try {
    // Koristi userId iz auth middleware-a umesto iz body-ja
    const itemData = {
      ...req.body,
      userId: req.user.id,
    };
    const item = new EdcItem(itemData);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getEdcItems = async (req, res) => {
  try {
    // Filtriraj predmete po korisniku
    const items = await EdcItem.find({ userId: req.user.id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEdcItemById = async (req, res) => {
  try {
    const item = await EdcItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEdcItem = async (req, res) => {
  try {
    const item = await EdcItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteEdcItem = async (req, res) => {
  try {
    const item = await EdcItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
