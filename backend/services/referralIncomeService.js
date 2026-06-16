const User = require("../models/User");
const ReferralIncome = require("../models/ReferralIncome");

const levelPercentages = {
  1: 1,
  2: 0.5,
  3: 0.25,
};

const distributeReferralIncome = async (investingUserId, investmentAmount) => {
  let currentUser = await User.findById(investingUserId);

  for (let level = 1; level <= 3; level++) {
    if (!currentUser || !currentUser.referredBy) {
      break;
    }

    const parentUser = await User.findById(currentUser.referredBy);

    if (!parentUser) {
      break;
    }

    const percentage = levelPercentages[level];
    const incomeAmount = (investmentAmount * percentage) / 100;

    await ReferralIncome.create({
      receiverUser: parentUser._id,
      generatedByUser: investingUserId,
      level,
      incomeAmount,
      incomeDate: new Date(),
    });

    await User.findByIdAndUpdate(parentUser._id, {
      $inc: {
        walletBalance: incomeAmount,
        totalLevelIncomeEarned: incomeAmount,
      },
    });

    currentUser = parentUser;
  }
};

module.exports = {
  distributeReferralIncome,
};