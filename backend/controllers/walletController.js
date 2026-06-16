const User = require("../models/User");
const ROIHistory = require("../models/ROIHistory");
const ReferralIncome = require("../models/ReferralIncome");

const getWalletSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        walletBalance: user.walletBalance,
        totalROIEarned: user.totalROIEarned,
        totalLevelIncomeEarned: user.totalLevelIncomeEarned,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getWalletTransactions = async (req, res) => {
  try {
    const roiTransactions = await ROIHistory.find({ user: req.user._id });

    const referralTransactions = await ReferralIncome.find({
      receiverUser: req.user._id,
    }).populate("generatedByUser", "fullName email");

    const transactions = [
      ...roiTransactions.map((item) => ({
        type: "ROI",
        amount: item.roiAmount,
        date: item.roiDate,
        status: item.status,
      })),

      ...referralTransactions.map((item) => ({
        type: "Referral",
        amount: item.incomeAmount,
        level: item.level,
        generatedByUser: item.generatedByUser,
        date: item.incomeDate,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWalletSummary,
  getWalletTransactions,
};