import mongoose from "mongoose";

const edcItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    type: { type: String, required: true },
    icon: { type: String, required: true },
    usageLimit: { type: Number }, // opciono
  },
  { timestamps: true }
);

const EdcItem = mongoose.model("EdcItem", edcItemSchema);
export default EdcItem;
