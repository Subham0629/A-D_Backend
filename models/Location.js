const mongoose = require("mongoose");
const config = require("../config/env");

const LocationSchema = new mongoose.Schema(
  {
    location_name: {
      type: String,
      required: true,
    },
    warehouse: { type: Array, default: [] },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
LocationSchema.set("autoIndex", config.db.autoIndex);
module.exports = mongoose.model("location", LocationSchema);
