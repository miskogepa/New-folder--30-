const JournalEntry = require("../models/JournalEntry.model");

// Vrati unos za korisnika i dan
exports.getEntryByDate = async (req, res) => {
  const userId = req.user.id;
  const date = req.query.date;
  if (!date) return res.status(400).json({ message: "Date is required" });
  const entry = await JournalEntry.findOne({ userId, date });
  if (!entry) return res.status(404).json({ message: "Entry not found" });
  res.json(entry);
};

// Vrati sve unose korisnika
exports.getAllEntries = async (req, res) => {
  const userId = req.user.id;
  const entries = await JournalEntry.find({ userId }).sort({ date: -1 });
  res.json(entries);
};

// Kreiraj ili ažuriraj unos za dan
exports.createOrUpdateEntry = async (req, res) => {
  const userId = req.user.id;
  const { date, text } = req.body;
  if (!date || !text)
    return res.status(400).json({ message: "Date and text are required" });
  const entry = await JournalEntry.findOneAndUpdate(
    { userId, date },
    { text },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json(entry);
};

// Izmeni unos po ID-u
exports.updateEntry = async (req, res) => {
  const userId = req.user.id;
  const { text } = req.body;
  const entry = await JournalEntry.findById(req.params.id);
  if (!entry) return res.status(404).json({ message: "Entry not found" });
  if (entry.userId.toString() !== userId)
    return res.status(403).json({ message: "Forbidden" });
  entry.text = text || entry.text;
  await entry.save();
  res.json(entry);
};

// Obriši unos po ID-u
exports.deleteEntry = async (req, res) => {
  const userId = req.user.id;
  const entry = await JournalEntry.findById(req.params.id);
  if (!entry) return res.status(404).json({ message: "Entry not found" });
  if (entry.userId.toString() !== userId)
    return res.status(403).json({ message: "Forbidden" });
  await entry.deleteOne();
  res.json({ message: "Entry deleted" });
};
