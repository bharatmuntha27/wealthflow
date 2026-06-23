const express = require("express");
const router = express.Router();

const {
  createWithdrawal,
} = require("../controllers/withdrawController");

const {
  protect,
} = require("../middleware/authMiddleware");

router.post(
  "/request",
  protect,
  createWithdrawal
);

module.exports = router;