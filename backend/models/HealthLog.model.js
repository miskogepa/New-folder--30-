import mongoose from "mongoose";

const healthLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    water: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    training: { type: Number, default: 0 },
    supplements: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const HealthLog = mongoose.model("HealthLog", healthLogSchema);
export default HealthLog;
