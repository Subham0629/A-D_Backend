const mongoose = require("mongoose");
const config = require("../config/env");

const WarehouseSchema = new mongoose.Schema(
  {
    warehouse_name: {
      type: String,
      required: true,
    },

    location: {
      type: schema.Types.ObjectId,
      required: true,
    },
    created_by: String,
    updated_by: String,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
WarehouseSchema.set("autoIndex", config.db.autoIndex);
module.exports = mongoose.model("warehouse", WarehouseSchema);
