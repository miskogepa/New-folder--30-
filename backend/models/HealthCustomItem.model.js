import mongoose from "mongoose";

const healthCustomItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  label: { type: String, required: true },
  iconId: { type: String, required: true },
  limit: { type: Number, required: true },
});

const HealthCustomItem = mongoose.model(
  "HealthCustomItem",
  healthCustomItemSchema
);
export default HealthCustomItem;
