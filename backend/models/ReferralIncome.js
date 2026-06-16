const mongoose = require("mongoose");

const referralIncomeSchema = new mongoose.Schema(
  {
    receiverUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    generatedByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    level: {
      type: Number,
      required: true,
    },

    incomeAmount: {
      type: Number,
      required: true,
    },

    incomeDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

referralIncomeSchema.index({
  receiverUser: 1,
  generatedByUser: 1,
  level: 1,
});

module.exports = mongoose.model(
  "ReferralIncome",
  referralIncomeSchema
);