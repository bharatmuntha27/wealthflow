const ReferralIncome = require("../models/ReferralIncome");

const getReferralIncomeHistory = async (req, res) => {
  try {
    const incomeHistory = await ReferralIncome.find({
      receiverUser: req.user._id,
    })
      .populate("generatedByUser", "fullName email")
      .sort({ incomeDate: -1 });

    res.status(200).json({
      success: true,
      count: incomeHistory.length,
      incomeHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getReferralIncomeHistory,
};