import HealthLog from "../models/HealthLog.model.js";

export const createHealthLog = async (req, res) => {
  try {
    const log = new HealthLog(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
