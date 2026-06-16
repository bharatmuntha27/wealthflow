const Investment = require("../models/Investment");
const ROIHistory = require("../models/ROIHistory");
const User = require("../models/User");

const processDailyROI = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeInvestments = await Investment.find({
      status: "Active",
      startDate: { $lte: today },
      endDate: { $gte: today },
    });

    for (const investment of activeInvestments) {
      const existingROI = await ROIHistory.findOne({
        investment: investment._id,
        roiDate: today,
      });

      if (existingROI) {
        continue;
      }

      const roiAmount =
        (investment.investmentAmount * investment.dailyROI) / 100;

      await ROIHistory.create({
        user: investment.user,
        investment: investment._id,
        roiAmount,
        roiDate: today,
        status: "Credited",
      });

      await User.findByIdAndUpdate(investment.user, {
        $inc: {
          walletBalance: roiAmount,
          totalROIEarned: roiAmount,
        },
      });
    }

    console.log("Daily ROI processed successfully");
  } catch (error) {
    console.error("Daily ROI processing failed:", error.message);
  }
};

module.exports = {
  processDailyROI,
};