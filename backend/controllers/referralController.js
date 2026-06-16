const User = require("../models/User");

// Direct Referrals
const getDirectReferrals = async (req, res) => {
  try {
    const referrals = await User.find({
      referredBy: req.user._id,
    }).select("-password");

    res.status(200).json({
      success: true,
      count: referrals.length,
      referrals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Recursive function
const buildReferralTree = async (userId) => {
  const referrals = await User.find({
    referredBy: userId,
  }).select("-password");

  const tree = [];

  for (const referral of referrals) {
    const children = await buildReferralTree(referral._id);

    tree.push({
      user: referral,
      children,
    });
  }

  return tree;
};

// Complete Tree API
const getReferralTree = async (req, res) => {
  try {
    const tree = await buildReferralTree(req.user._id);

    res.status(200).json({
      success: true,
      tree,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDirectReferrals,
  getReferralTree,
};