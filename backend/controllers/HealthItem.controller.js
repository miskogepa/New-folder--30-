import HealthItem from "../models/HealthItem.model.js";

export const createHealthItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const healthItemData = { ...req.body, userId };

    const healthItem = new HealthItem(healthItemData);
    await healthItem.save();

    res.status(201).json(healthItem);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Health item sa ovim ključem već postoji" });
    }
    res.status(400).json({ error: error.message });
  }
};

export const getHealthItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const healthItems = await HealthItem.find({ userId, isActive: true }).sort({
      order: 1,
      createdAt: 1,
    });

    res.json(healthItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHealthItemById = async (req, res) => {
  try {
    const userId = req.user.id;
    const healthItem = await HealthItem.findOne({
      _id: req.params.id,
      userId,
    });

    if (!healthItem) {
      return res.status(404).json({ error: "Health item nije pronađen" });
    }

    res.json(healthItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateHealthItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const healthItem = await HealthItem.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!healthItem) {
      return res.status(404).json({ error: "Health item nije pronađen" });
    }

    res.json(healthItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteHealthItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const healthItem = await HealthItem.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!healthItem) {
      return res.status(404).json({ error: "Health item nije pronađen" });
    }

    res.json({ message: "Health item je obrisan" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateHealthItemOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body; // Array of { id, order }

    const updatePromises = items.map(({ id, order }) =>
      HealthItem.findOneAndUpdate({ _id: id, userId }, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    const updatedItems = await HealthItem.find({ userId, isActive: true }).sort(
      { order: 1, createdAt: 1 }
    );

    res.json(updatedItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
