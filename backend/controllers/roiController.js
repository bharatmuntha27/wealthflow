const ROIHistory = require("../models/ROIHistory");
const User = require("../models/User");

// Get ROI History
const getROIHistory = async (req, res) => {
  try {
    const roiHistory = await ROIHistory.find({
      user: req.user._id,
    })
      .populate("investment")
      .sort({ roiDate: -1 });

    res.status(200).json({
      success: true,
      count: roiHistory.length,
      roiHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create Sample ROI
const createSampleROI = async (req, res) => {
  try {
    const { investmentId, roiAmount, roiDate } = req.body;

    const roi = await ROIHistory.create({
      user: req.user._id,
      investment: investmentId,
      roiAmount,
      roiDate,
      status: "Credited",
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        walletBalance: roiAmount,
        totalROIEarned: roiAmount,
      },
    });

    res.status(201).json({
      success: true,
      message: "Sample ROI created successfully",
      roi,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getROIHistory,
  createSampleROI,
};