const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    minDeposit: {
      type: Number,
      default: 500,
    },

    maxDeposit: {
      type: Number,
      default: 500000,
    },

    minWithdrawal: {
      type: Number,
      default: 100,
    },

    dailyROIPercentage: {
      type: Number,
      default: 1, // e.g. 1%
    },

    adminUpiId: {
      type: String,
      default: "wealthflow@upi",
    },

    adminBankName: {
      type: String,
      default: "HDFC Bank",
    },

    adminBankAccountHolder: {
      type: String,
      default: "WealthFlow Pvt Ltd",
    },

    adminBankAccountNumber: {
      type: String,
      default: "123456789012",
    },

    adminBankIfsc: {
      type: String,
      default: "HDFC0001234",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);
