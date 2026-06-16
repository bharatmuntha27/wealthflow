const express = require("express");
const router = express.Router();

const {
  createInvestment,
  getMyInvestments,
  updateInvestmentStatus,
  getInvestmentById,
  getAllInvestments,
} = require("../controllers/investmentController");

const { protect } = require("../middleware/authMiddleware");

console.log("Investment routes file loaded");

// Create Investment
router.post("/", protect, createInvestment);

// Get My Investments
router.get("/my", protect, getMyInvestments);

// Get All Investments
router.get("/all", protect, getAllInvestments);

// Get Single Investment By ID
router.get("/:id", protect, getInvestmentById);

// Update Investment Status
router.patch("/:id/status", protect, updateInvestmentStatus);

module.exports = router;