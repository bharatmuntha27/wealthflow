const User = require("../models/User");
const Investment = require("../models/Investment");

const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const investments = await Investment.find({
      user: req.user._id,
    });

    const totalInvestments = investments.reduce(
      (sum, investment) => sum + investment.investmentAmount,
      0
    );

    res.status(200).json({
      success: true,
      data: {
        totalInvestments,
        walletBalance: user.walletBalance,
        totalROIEarned: user.totalROIEarned,
        totalLevelIncomeEarned: user.totalLevelIncomeEarned,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getDashboard };