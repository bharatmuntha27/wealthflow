const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getReferralIncomeHistory,
} = require("../controllers/referralIncomeController");

router.get("/history", protect, getReferralIncomeHistory);

module.exports = router;