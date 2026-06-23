const User = require("../models/User");
const Withdrawal = require("../models/Withdrawal");

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

    if (user.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
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
      message: "Withdrawal request submitted",
      withdrawal,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createWithdrawal,
};