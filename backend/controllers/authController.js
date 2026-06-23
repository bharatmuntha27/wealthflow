const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const generateReferralCode = (fullName) => {
  const namePart = fullName.replace(/\s+/g, "").substring(0, 4).toUpperCase();
  const randomPart = Math.floor(10000 + Math.random() * 90000);
  return `${namePart}${randomPart}`;
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, password, referralCode } = req.body;

    if (!fullName || !email || !mobileNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or mobile number",
      });
    }

    let referredBy = null;

    if (referralCode) {
      const parentUser = await User.findOne({ referralCode });

      if (!parentUser) {
        return res.status(400).json({
          success: false,
          message: "Invalid referral code",
        });
      }

      referredBy = parentUser._id;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      mobileNumber,
      password: hashedPassword,
      referralCode: generateReferralCode(fullName),
      referredBy,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(newUser._id),
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        mobileNumber: newUser.mobileNumber,
        referralCode: newUser.referralCode,
        walletBalance: newUser.walletBalance,
        totalROIEarned: newUser.totalROIEarned,
        totalLevelIncomeEarned: newUser.totalLevelIncomeEarned,
        accountStatus: newUser.accountStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    let isPasswordMatch = false;

if (user.password.startsWith("$2b$")) {
  isPasswordMatch = await bcrypt.compare(password, user.password);
} else {
  isPasswordMatch = password === user.password;
}

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.accountStatus !== "Active") {
      return res.status(403).json({
        success: false,
        message: "Your account is not active",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user: {
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  mobileNumber: user.mobileNumber,
  referralCode: user.referralCode,
  walletBalance: user.walletBalance,
  totalROIEarned: user.totalROIEarned,
  totalLevelIncomeEarned: user.totalLevelIncomeEarned,
  accountStatus: user.accountStatus,
  role: user.role,
},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// Forgot Password

const forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {

      return res.status(400).json({
        success: false,
        message: "Email is required",
      });

    }

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken =
      resetToken;

    user.resetPasswordExpires =
      Date.now() + 3600000; // 1 hour

    await user.save();

    return res.status(200).json({

      success: true,

      message:
        "Password reset token generated",

      token: resetToken,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
        "Forgot password failed",

      error: error.message,

    });

  }

};

// Reset Password

const resetPassword = async (req, res) => {

  try {

    const {
      token,
      password,
    } = req.body;

    if (!token || !password) {

      return res.status(400).json({
        success: false,
        message:
          "Token and password are required",
      });

    }

    const user =
      await User.findOne({

        resetPasswordToken:
          token,

        resetPasswordExpires: {
          $gt: Date.now(),
        },

      });

    if (!user) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid or expired token",

      });

    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    user.password =
      hashedPassword;

    user.resetPasswordToken =
      undefined;

    user.resetPasswordExpires =
      undefined;

    await user.save();

    return res.status(200).json({

      success: true,

      message:
        "Password updated successfully",

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
        "Reset password failed",

      error: error.message,

    });

  }

};
module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};