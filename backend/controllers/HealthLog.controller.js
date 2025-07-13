import HealthLog from "../models/HealthLog.model.js";

export const createHealthLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, ...healthData } = req.body;

    // Proveri da li već postoji log za ovaj datum i korisnika
    const existingLog = await HealthLog.findOne({
      userId,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999),
      },
    });

    let log;
    if (existingLog) {
      // Ažuriraj postojeći log
      log = await HealthLog.findByIdAndUpdate(
        existingLog._id,
        { ...healthData },
        { new: true }
      );
    } else {
      // Kreiraj novi log
      log = new HealthLog({
        userId,
        date: new Date(date),
        ...healthData,
      });
      await log.save();
    }

    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getHealthLogs = async (req, res) => {
  try {
    const { date } = req.query;
    const userId = req.user.id; // Iz auth middleware-a

    let query = { userId };

    // Ako je prosleđen datum, filtriraj po datumu
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const logs = await HealthLog.find(query);
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
