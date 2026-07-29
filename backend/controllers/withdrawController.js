const User = require("../models/User");
const Withdrawal = require("../models/Withdrawal");
const Settings = require("../models/Settings");

// Create Withdrawal Request
const createWithdrawal = async (req, res) => {
  try {
    const {
      amount,
      accountName,
      accountNumber,
      ifscCode,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid withdrawal amount",
      });
    }

    // Get system settings for min withdrawal
    const settings = await Settings.findOne() || { minWithdrawal: 100 };
    if (amount < settings.minWithdrawal) {
      return res.status(400).json({
        success: false,
        message: `Minimum withdrawal amount is ₹${settings.minWithdrawal}`,
      });
    }

    if (user.walletBalance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance",
      });
    }

    const withdrawal = await Withdrawal.create({
      user: user._id,
      amount,
      accountName,
      accountNumber,
      ifscCode,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Withdrawal request submitted successfully. Waiting for admin approval.",
      withdrawal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// Get Logged-in User's Withdrawals
const getMyWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: withdrawals.length,
      withdrawals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createWithdrawal,
  getMyWithdrawals,
};