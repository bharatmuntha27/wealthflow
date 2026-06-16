const mongoose = require("mongoose");

const roiHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investment",
      required: true,
    },

    roiAmount: {
      type: Number,
      required: true,
    },

    roiDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Credited", "Pending", "Failed"],
      default: "Credited",
    },
  },
  {
    timestamps: true,
  }
);

roiHistorySchema.index({ investment: 1, roiDate: 1 }, { unique: true });

module.exports = mongoose.model("ROIHistory", roiHistorySchema);