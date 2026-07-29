const User = require("../models/User");
const Investment = require("../models/Investment");
const Deposit = require("../models/Deposit");
const Withdrawal = require("../models/Withdrawal");
const ROIHistory = require("../models/ROIHistory");
const ReferralIncome = require("../models/ReferralIncome");
const WalletTransaction = require("../models/WalletTransaction");
const Settings = require("../models/Settings");

// Get Admin Dashboard Stats
const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const activeUsers = await User.countDocuments({ role: "user", accountStatus: "Active" });
    const blockedUsers = await User.countDocuments({ role: "user", accountStatus: "Blocked" });

    // Total active investments amount
    const activeInvestmentsResult = await Investment.aggregate([
      { $match: { status: "Active" } },
      { $group: { _id: null, total: { $sum: "$investmentAmount" } } },
    ]);
    const totalInvestments = activeInvestmentsResult[0]?.total || 0;

    // Total Wallet Balance across all users
    const totalWalletResult = await User.aggregate([
      { $match: { role: "user" } },
      { $group: { _id: null, total: { $sum: "$walletBalance" } } },
    ]);
    const totalWalletBalance = totalWalletResult[0]?.total || 0;

    // Total Approved Deposits
    const approvedDepositsResult = await Deposit.aggregate([
      { $match: { status: "Approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalDeposits = approvedDepositsResult[0]?.total || 0;

    // Total Approved Withdrawals
    const approvedWithdrawalsResult = await Withdrawal.aggregate([
      { $match: { status: "Approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalWithdrawals = approvedWithdrawalsResult[0]?.total || 0;

    // Total ROI Credited
    const roiResult = await ROIHistory.aggregate([
      { $group: { _id: null, total: { $sum: "$roiAmount" } } },
    ]);
    const totalROI = roiResult[0]?.total || 0;

    // Total Referral Income Credited
    const referralIncomeResult = await ReferralIncome.aggregate([
      { $group: { _id: null, total: { $sum: "$incomeAmount" } } },
    ]);
    const totalReferralIncome = referralIncomeResult[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        blockedUsers,
        totalInvestments,
        totalWalletBalance,
        totalDeposits,
        totalWithdrawals,
        totalROI,
        totalReferralIncome,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .populate("referredBy", "fullName email")
      .sort({ createdAt: -1 });

    res.json({
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

// Update User Account Status (Active, Blocked)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Active", "Blocked", "Inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.accountStatus = status;
    await user.save();

    res.json({
      success: true,
      message: `User account status updated to ${status}`,
      user: {
        id: user._id,
        fullName: user.fullName,
        accountStatus: user.accountStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Adjust User Balance (Credit/Debit)
const adjustUserBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, remarks } = req.body;

    if (amount === undefined || amount === 0) {
      return res.status(400).json({
        success: false,
        message: "Valid adjustment amount is required",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Adjust balance
    user.walletBalance = (user.walletBalance || 0) + Number(amount);
    await user.save();

    // Create a transaction log
    const type = amount > 0 ? "Deposit" : "Withdrawal";
    const absoluteAmount = Math.abs(amount);

    await WalletTransaction.create({
      user: user._id,
      type,
      amount: absoluteAmount,
      status: "Success",
      remarks: remarks || `Balance adjusted by Admin: ${amount > 0 ? "Credited" : "Debited"} ₹${absoluteAmount}`,
    });

    res.json({
      success: true,
      message: `Wallet balance adjusted successfully. New balance: ₹${user.walletBalance}`,
      walletBalance: user.walletBalance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Investments
const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find()
      .populate("user", "fullName email mobileNumber")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: investments.length,
      investments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Deposits
const getDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find()
      .populate("user", "fullName email mobileNumber")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: deposits.length,
      deposits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Deposit Status (Approve/Reject)
const updateDepositStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be Approved or Rejected.",
      });
    }

    const deposit = await Deposit.findById(id).populate("user");
    if (!deposit) {
      return res.status(404).json({
        success: false,
        message: "Deposit request not found",
      });
    }

    if (deposit.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `This deposit request has already been ${deposit.status.toLowerCase()}`,
      });
    }

    deposit.status = status;
    await deposit.save();

    if (status === "Approved") {
      // Credit user's wallet balance
      const user = await User.findById(deposit.user._id);
      user.walletBalance = (user.walletBalance || 0) + deposit.amount;
      await user.save();

      // Write wallet transaction log
      await WalletTransaction.create({
        user: user._id,
        type: "Deposit",
        amount: deposit.amount,
        status: "Success",
        remarks: `Deposit Approved. UTR: ${deposit.utrNumber}`,
      });
    } else {
      // Write failed wallet transaction log
      await WalletTransaction.create({
        user: deposit.user._id,
        type: "Deposit",
        amount: deposit.amount,
        status: "Failed",
        remarks: `Deposit Rejected. UTR: ${deposit.utrNumber}`,
      });
    }

    res.json({
      success: true,
      message: `Deposit request successfully ${status.toLowerCase()}`,
      deposit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Withdrawals
const getWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate("user", "fullName email mobileNumber")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: withdrawals.length,
      withdrawals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Withdrawal Status (Approve/Reject)
const updateWithdrawalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be Approved or Rejected.",
      });
    }

    const withdrawal = await Withdrawal.findById(id).populate("user");
    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: "Withdrawal request not found",
      });
    }

    if (withdrawal.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `This withdrawal request has already been ${withdrawal.status.toLowerCase()}`,
      });
    }

    if (status === "Approved") {
      const user = await User.findById(withdrawal.user._id);
      if (user.walletBalance < withdrawal.amount) {
        return res.status(400).json({
          success: false,
          message: "User has insufficient balance to approve this withdrawal request",
        });
      }

      withdrawal.status = "Approved";
      await withdrawal.save();

      // Deduct balance
      user.walletBalance = user.walletBalance - withdrawal.amount;
      await user.save();

      // Create transaction log
      await WalletTransaction.create({
        user: user._id,
        type: "Withdrawal",
        amount: withdrawal.amount,
        status: "Success",
        remarks: "Withdrawal approved and processed to bank details.",
      });
    } else {
      withdrawal.status = "Rejected";
      await withdrawal.save();

      // Create transaction log
      await WalletTransaction.create({
        user: withdrawal.user._id,
        type: "Withdrawal",
        amount: withdrawal.amount,
        status: "Failed",
        remarks: "Withdrawal rejected by Admin.",
      });
    }

    res.json({
      success: true,
      message: `Withdrawal request successfully ${status.toLowerCase()}`,
      withdrawal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All ROI History
const getROIHistory = async (req, res) => {
  try {
    const history = await ROIHistory.find()
      .populate("user", "fullName email")
      .populate("investment", "planName investmentAmount")
      .sort({ roiDate: -1 });

    res.json({
      success: true,
      count: history.length,
      roiHistory: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Referral Income
const getReferralIncome = async (req, res) => {
  try {
    const income = await ReferralIncome.find()
      .populate("receiverUser", "fullName email")
      .populate("generatedByUser", "fullName email")
      .sort({ incomeDate: -1 });

    res.json({
      success: true,
      count: income.length,
      referralIncome: income,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Wallet Transactions
const getWalletTransactions = async (req, res) => {
  try {
    // We fetch from the database WalletTransaction collection
    const transactions = await WalletTransaction.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    // Also get merged transactions from ROI and Referral to support showing all
    const roiTransactions = await ROIHistory.find().populate("user", "fullName email");
    const referralTransactions = await ReferralIncome.find()
      .populate("receiverUser", "fullName email")
      .populate("generatedByUser", "fullName email");

    const merged = [
      ...transactions.map(t => ({
        _id: t._id,
        user: t.user,
        type: t.type,
        amount: t.amount,
        status: t.status,
        remarks: t.remarks,
        createdAt: t.createdAt,
      })),
      ...roiTransactions.map(t => ({
        _id: t._id,
        user: t.user,
        type: "ROI",
        amount: t.roiAmount,
        status: "Success",
        remarks: `Daily ROI Credited. Status: ${t.status}`,
        createdAt: t.roiDate || t.createdAt,
      })),
      ...referralTransactions.map(t => ({
        _id: t._id,
        user: t.receiverUser,
        type: "Referral Income",
        amount: t.incomeAmount,
        status: "Success",
        remarks: `Level ${t.level} Referral Commission from ${t.generatedByUser?.fullName || "User"}`,
        createdAt: t.incomeDate || t.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      count: merged.length,
      transactions: merged,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get System Reports
const getReports = async (req, res) => {
  try {
    // Generate simple aggregation reports
    const totalUsers = await User.countDocuments({ role: "user" });
    
    const depositStats = await Deposit.aggregate([
      { $match: { status: "Approved" } },
      { $group: { _id: null, count: { $sum: 1 }, total: { $sum: "$amount" } } }
    ]);

    const withdrawStats = await Withdrawal.aggregate([
      { $match: { status: "Approved" } },
      { $group: { _id: null, count: { $sum: 1 }, total: { $sum: "$amount" } } }
    ]);

    const roiStats = await ROIHistory.aggregate([
      { $group: { _id: null, count: { $sum: 1 }, total: { $sum: "$roiAmount" } } }
    ]);

    const referralStats = await ReferralIncome.aggregate([
      { $group: { _id: null, count: { $sum: 1 }, total: { $sum: "$incomeAmount" } } }
    ]);

    res.json({
      success: true,
      report: {
        totalUsers,
        deposits: {
          count: depositStats[0]?.count || 0,
          totalAmount: depositStats[0]?.total || 0,
        },
        withdrawals: {
          count: withdrawStats[0]?.count || 0,
          totalAmount: withdrawStats[0]?.total || 0,
        },
        roiPaid: {
          count: roiStats[0]?.count || 0,
          totalAmount: roiStats[0]?.total || 0,
        },
        referralPaid: {
          count: referralStats[0]?.count || 0,
          totalAmount: referralStats[0]?.total || 0,
        },
        netSystemFlow: (depositStats[0]?.total || 0) - (withdrawStats[0]?.total || 0),
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get System Settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        minDeposit: 500,
        maxDeposit: 500000,
        minWithdrawal: 100,
        dailyROIPercentage: 1,
        adminUpiId: "wealthflow@upi",
        adminBankName: "HDFC Bank",
        adminBankAccountHolder: "WealthFlow Pvt Ltd",
        adminBankAccountNumber: "123456789012",
        adminBankIfsc: "HDFC0001234",
      });
    }

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update System Settings
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    const {
      minDeposit,
      maxDeposit,
      minWithdrawal,
      dailyROIPercentage,
      adminUpiId,
      adminBankName,
      adminBankAccountHolder,
      adminBankAccountNumber,
      adminBankIfsc,
    } = req.body;

    settings.minDeposit = minDeposit !== undefined ? Number(minDeposit) : settings.minDeposit;
    settings.maxDeposit = maxDeposit !== undefined ? Number(maxDeposit) : settings.maxDeposit;
    settings.minWithdrawal = minWithdrawal !== undefined ? Number(minWithdrawal) : settings.minWithdrawal;
    settings.dailyROIPercentage = dailyROIPercentage !== undefined ? Number(dailyROIPercentage) : settings.dailyROIPercentage;
    settings.adminUpiId = adminUpiId || settings.adminUpiId;
    settings.adminBankName = adminBankName || settings.adminBankName;
    settings.adminBankAccountHolder = adminBankAccountHolder || settings.adminBankAccountHolder;
    settings.adminBankAccountNumber = adminBankAccountNumber || settings.adminBankAccountNumber;
    settings.adminBankIfsc = adminBankIfsc || settings.adminBankIfsc;

    await settings.save();

    res.json({
      success: true,
      message: "System settings updated successfully",
      settings,
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
  getUsers,
  updateUserStatus,
  adjustUserBalance,
  getInvestments,
  getDeposits,
  updateDepositStatus,
  getWithdrawals,
  updateWithdrawalStatus,
  getROIHistory,
  getReferralIncome,
  getWalletTransactions,
  getReports,
  getSettings,
  updateSettings,
};