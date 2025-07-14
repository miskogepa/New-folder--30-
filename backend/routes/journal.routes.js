const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const journal = require("../controllers/JournalEntry.controller");

router.get("/", auth, (req, res, next) => {
  if (req.query.date) {
    return journal.getEntryByDate(req, res, next);
  }
  return journal.getAllEntries(req, res, next);
});

router.post("/", auth, journal.createOrUpdateEntry);
router.put("/:id", auth, journal.updateEntry);
router.delete("/:id", auth, journal.deleteEntry);

module.exports = router;
