const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Get Logged-in User Profile
const getUserProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id)
      .select("-password");

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Update Profile
const updateUserProfile = async (req, res) => {
  try {

    const {
      fullName,
      email,
      mobileNumber
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.mobileNumber = mobileNumber || user.mobileNumber;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Change Password
const changePassword = async (req, res) => {
  try {

    const {
      oldPassword,
      newPassword
    } = req.body;

    const user = await User.findById(req.user._id);

    let passwordMatched = false;

    if (user.password.startsWith("$2")) {

      passwordMatched = await bcrypt.compare(
        oldPassword,
        user.password
      );

    } else {

      passwordMatched = oldPassword === user.password;

    }

    if (!passwordMatched) {

      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });

    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Admin - Get All Users
const getAllUsers = async (req, res) => {
  try {

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// verifyEmail
const verifyEmail = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.emailVerified = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// verifyMobile
const verifyMobile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.mobileVerified = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Mobile verified successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// getDirectReferrals
const enableTwoFactor = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.twoFactorEnabled = !user.twoFactorEnabled;

    await user.save();

    res.status(200).json({
      success: true,
      message: user.twoFactorEnabled
        ? "Two-Factor Authentication Enabled"
        : "Two-Factor Authentication Disabled",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// updateBankDetails
const updateBankDetails = async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.bankName = req.body.bankName;
    user.accountHolderName = req.body.accountHolderName;
    user.accountNumber = req.body.accountNumber;
    user.ifscCode = req.body.ifscCode;
    user.upiId = req.body.upiId;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Bank details updated successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

  const getDirectReferrals = async (req, res) => {

  try {

    const referrals = await User.find({
      referredBy: req.user._id,
    }).select(
      "fullName email mobileNumber createdAt"
    );

    res.status(200).json({
      success: true,
      referrals,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
}
};

// getDirectReferrals
const getDirectReferrals = async (req, res) => {

  try {

    const referrals = await User.find({
      referredBy: req.user._id,
    }).select(
      "fullName email mobileNumber referralCode createdAt"
    );

    res.status(200).json({
      success: true,
      referrals,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
// Get Referral Tree
const getReferralTree = async (req, res) => {

  try {

    const level1 = await User.find({
      referredBy: req.user._id,
    }).select(
      "fullName email referralCode"
    );

    res.status(200).json({
      success: true,
      level1,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
module.exports = {

  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  verifyEmail,
  verifyMobile,
  enableTwoFactor,
  updateBankDetails,
  getDirectReferrals,
  getReferralTree,
};
