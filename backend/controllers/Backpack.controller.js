import Backpack from "../models/Backpack.model.js";

export const createBackpack = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, grid, items } = req.body;
    // Pronađi da li već postoji backpack za userId i date
    let backpack = await Backpack.findOne({
      userId,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999),
      },
    });
    if (backpack) {
      // Ažuriraj postojeći backpack
      backpack.grid = grid;
      backpack.items = items;
      await backpack.save();
      return res.status(200).json(backpack);
    } else {
      // Kreiraj novi backpack
      backpack = new Backpack({ userId, date, grid, items });
      await backpack.save();
      return res.status(201).json(backpack);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getBackpacks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;
    let query = { userId };
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }
    const backpacks = await Backpack.find(query);
    // Ako je tražen date, vrati samo jedan (ili prazan niz)
    if (date) {
      return res.json(backpacks.length > 0 ? backpacks[0] : null);
    }
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
