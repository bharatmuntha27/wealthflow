const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  verifyEmail,
  verifyMobile,
  enableTwoFactor,
  updateBankDetails,
  getDirectReferrals,
  getReferralTree,
} = require("../controllers/userController");
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);
router.put("/verify-email", protect, verifyEmail);
router.put("/verify-mobile", protect, verifyMobile);
router.put("/two-factor", protect, enableTwoFactor);
router.put("/bank-details", protect, updateBankDetails);
router.get("/referrals/direct", protect, getDirectReferrals);
router.get("/referrals/tree", protect, getReferralTree);
router.get("/", protect, getAllUsers);

module.exports = router;

