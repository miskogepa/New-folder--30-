import mongoose from "mongoose";

const backpackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "EdcItem" }],
  },
  { timestamps: true }
);

const Backpack = mongoose.model("Backpack", backpackSchema);
export default Backpack;
