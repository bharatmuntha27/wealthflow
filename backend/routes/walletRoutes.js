const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getWalletSummary,
  getWalletTransactions,
} = require("../controllers/walletController");

router.get("/", protect, getWalletSummary);
router.get("/transactions", protect, getWalletTransactions);
router.get("/history", protect, getWalletTransactions);

module.exports = router;