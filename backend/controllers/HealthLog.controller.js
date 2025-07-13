import HealthLog from "../models/HealthLog.model.js";

export const upsertHealthLog = async (req, res) => {
  try {
    const { date, ...rest } = req.body;
    const userId = req.user.id;
    if (!date) return res.status(400).json({ error: "Date is required" });
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    const log = await HealthLog.findOneAndUpdate(
      { userId, date: { $gte: start, $lte: end } },
      { userId, date, ...rest },
      { upsert: true, new: true }
    );
    res.json(log);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getHealthLogForUserAndDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = req.query.date;
    if (!date) return res.status(400).json({ error: "Date is required" });
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    const log = await HealthLog.findOne({
      userId,
      date: { $gte: start, $lte: end },
    });
    res.json(log || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ove funkcije ostavljamo za admin/advanced API
export const getHealthLogs = async (req, res) => {
  try {
    const logs = await HealthLog.find();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHealthLogById = async (req, res) => {
  try {
    const log = await HealthLog.findById(req.params.id);
    if (!log) return res.status(404).json({ error: "HealthLog not found" });
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateHealthLog = async (req, res) => {
  try {
    const log = await HealthLog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!log) return res.status(404).json({ error: "HealthLog not found" });
    res.json(log);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteHealthLog = async (req, res) => {
  try {
    const log = await HealthLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ error: "HealthLog not found" });
    res.json({ message: "HealthLog deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
