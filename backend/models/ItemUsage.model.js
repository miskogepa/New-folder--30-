import mongoose from "mongoose";

const itemUsageSchema = new mongoose.Schema(
  {
    backpackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Backpack",
      required: true,
    },
    edcItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EdcItem",
      required: true,
    },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ItemUsage = mongoose.model("ItemUsage", itemUsageSchema);
export default ItemUsage;
