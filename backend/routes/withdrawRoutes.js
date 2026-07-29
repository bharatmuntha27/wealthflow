const express = require("express");
const router = express.Router();

const {
  createWithdrawal,
  getMyWithdrawals,
} = require("../controllers/withdrawController");

const {
  protect,
} = require("../middleware/authMiddleware");

router.post(
  "/request",
  protect,
  createWithdrawal
);

router.get(
  "/my",
  protect,
  getMyWithdrawals
);

module.exports = router;