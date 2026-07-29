const Deposit = require("../models/Deposit");
const Settings = require("../models/Settings");

// Create Deposit Request
const createDepositRequest = async (req, res) => {
  try {
    const { amount, paymentMethod, utrNumber, paymentProof } = req.body;

    if (!amount || !paymentMethod || !utrNumber) {
      return res.status(400).json({
        success: false,
        message: "Amount, payment method, and UTR number are required",
      });
    }

    // Get system settings
    const settings = await Settings.findOne() || { minDeposit: 500, maxDeposit: 500000 };

    if (amount < settings.minDeposit) {
      return res.status(400).json({
        success: false,
        message: `Minimum deposit amount is ₹${settings.minDeposit}`,
      });
    }

    if (amount > settings.maxDeposit) {
      return res.status(400).json({
        success: false,
        message: `Maximum deposit amount is ₹${settings.maxDeposit}`,
      });
    }

    // Check unique UTR
    const existingDeposit = await Deposit.findOne({ utrNumber });
    if (existingDeposit) {
      return res.status(400).json({
        success: false,
        message: "This UTR number has already been submitted",
      });
    }

    const deposit = await Deposit.create({
      user: req.user._id,
      amount,
      paymentMethod,
      utrNumber,
      paymentProof: paymentProof || "",
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Deposit request submitted successfully. Waiting for admin approval.",
      deposit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Logged-in User's Deposits
const getMyDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: deposits.length,
      deposits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Deposit Settings (for limits, UPI details etc)
const getDepositSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne() || {
      minDeposit: 500,
      maxDeposit: 500000,
      adminUpiId: "wealthflow@upi",
      adminBankName: "HDFC Bank",
      adminBankAccountHolder: "WealthFlow Pvt Ltd",
      adminBankAccountNumber: "123456789012",
      adminBankIfsc: "HDFC0001234",
    };

    res.status(200).json({
      success: true,
      settings: {
        minDeposit: settings.minDeposit,
        maxDeposit: settings.maxDeposit,
        adminUpiId: settings.adminUpiId,
        adminBankName: settings.adminBankName,
        adminBankAccountHolder: settings.adminBankAccountHolder,
        adminBankAccountNumber: settings.adminBankAccountNumber,
        adminBankIfsc: settings.adminBankIfsc,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createDepositRequest,
  getMyDeposits,
  getDepositSettings,
};
