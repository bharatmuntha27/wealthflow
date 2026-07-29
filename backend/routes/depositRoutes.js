const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createDepositRequest,
  getMyDeposits,
  getDepositSettings,
} = require("../controllers/depositController");

router.post("/request", protect, createDepositRequest);
router.get("/my", protect, getMyDeposits);
router.get("/settings", protect, getDepositSettings);

module.exports = router;
