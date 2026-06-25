const Investment = require("../models/Investment");
const { distributeReferralIncome } = require("../services/referralIncomeService");

// Create Investment
const createInvestment = async (req, res) => {
  try {
    const { investmentAmount, planName, startDate, endDate, dailyROI } = req.body;

    const investment = await Investment.create({
      user: req.user._id,
      investmentAmount,
      planName,
      startDate,
      endDate,
      dailyROI,
    });
    await distributeReferralIncome(req.user._id, investmentAmount);

    res.status(201).json({
      success: true,
      message: "Investment created successfully",
      investment,
    });
  } catch (error) {
    res.status(500).json({  
      success: false,
      message: error.message,
    });
  }
};

// Get User Investments
const getMyInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({
      user: req.user._id,
    });

    res.status(200).json({
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
const updateInvestmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const investment = await Investment.findById(id);

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment not found",
      });
    }

    investment.status = status;

    await investment.save();

    res.status(200).json({
      success: true,
      message: "Investment status updated",
      investment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getInvestmentById = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment not found",
      });
    }

    res.status(200).json({
      success: true,
      investment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllInvestments = async (req, res) => {
  try {
    const investments = await Investment.find().populate(
      "user",
      "fullName email mobileNumber"
    );

    res.status(200).json({
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

module.exports = {
  createInvestment,
  getMyInvestments,
  updateInvestmentStatus,
  getInvestmentById,
  getAllInvestments,
};

