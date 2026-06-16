const express = require("express");
const router = express.Router();

const {
  getDirectReferrals,
  getReferralTree,
} = require("../controllers/referralController");

const { protect } = require("../middleware/authMiddleware");

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Referral routes working",
  });
});

router.get("/direct", protect, getDirectReferrals);
router.get("/tree", protect, getReferralTree);

module.exports = router;