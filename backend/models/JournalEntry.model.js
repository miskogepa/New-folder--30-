const mongoose = require("mongoose");

const JournalEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // format: YYYY-MM-DD
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

JournalEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("JournalEntry", JournalEntrySchema);
