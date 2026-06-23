const User = require("../models/User");
const Investment = require("../models/Investment");

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const activeUsers = await User.countDocuments({
      accountStatus: "Active",
    });

    const totalInvestments = await Investment.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$investmentAmount",
          },
        },
      },
    ]);

    const walletBalance = await User.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$walletBalance",
          },
        },
      },
    ]);

    res.json({
      success: true,
      dashboard: {
        totalUsers,
        activeUsers,
        totalInvestment:
          totalInvestments.length > 0
            ? totalInvestments[0].total
            : 0,
        totalWallet:
          walletBalance.length > 0
            ? walletBalance[0].total
            : 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};