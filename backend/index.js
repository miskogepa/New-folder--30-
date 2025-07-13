import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import userRoutes from "./routes/user.routes.js";
import edcItemRoutes from "./routes/edcItem.routes.js";
import backpackRoutes from "./routes/backpack.routes.js";
import itemUsageRoutes from "./routes/itemUsage.routes.js";
import healthLogRoutes from "./routes/healthLog.routes.js";

dotenv.config();

connectDB();

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/items", edcItemRoutes);
app.use("/api/backpacks", backpackRoutes);
app.use("/api/item-usage", itemUsageRoutes);
app.use("/api/health", healthLogRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
