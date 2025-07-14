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
    // Novi grid: niz od 18 elemenata (za 3x6 grid)
    grid: [
      {
        type: {
          type: String, // 'edc' ili 'health'
          required: true,
        },
        edcItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "EdcItem",
        },
        healthKey: {
          type: String, // npr. 'water', 'food', ...
        },
      },
    ],
  },
  { timestamps: true }
);

const Backpack = mongoose.model("Backpack", backpackSchema);
export default Backpack;
