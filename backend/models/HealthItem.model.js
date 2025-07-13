import mongoose from "mongoose";

const healthItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    iconKey: {
      type: String,
      required: true,
      default: "water",
    },
    limit: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
      default: 1,
    },
    color: {
      type: String,
      default: "#A3A289",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Kompozitni indeks za userId i key
healthItemSchema.index({ userId: 1, key: 1 }, { unique: true });

const HealthItem = mongoose.model("HealthItem", healthItemSchema);
export default HealthItem;
