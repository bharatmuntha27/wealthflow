const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const {
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
} = require("../controllers/adminController");

// Base validation: protect & adminOnly
router.use(protect, adminOnly);

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.put("/users/:id/status", updateUserStatus);
router.put("/users/:id/balance", adjustUserBalance);
router.get("/investments", getInvestments);
router.get("/deposits", getDeposits);
router.put("/deposits/:id/status", updateDepositStatus);
router.get("/withdrawals", getWithdrawals);
router.put("/withdrawals/:id/status", updateWithdrawalStatus);
router.get("/roi-history", getROIHistory);
router.get("/referral-income", getReferralIncome);
router.get("/wallet-transactions", getWalletTransactions);
router.get("/reports", getReports);
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

module.exports = router;