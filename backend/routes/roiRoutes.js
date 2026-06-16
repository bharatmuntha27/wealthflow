const express = require("express");
const router = express.Router();

const {
  getROIHistory,
  createSampleROI,
} = require("../controllers/roiController");

const { protect } = require("../middleware/authMiddleware");

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "ROI routes working",
  });
});

router.get("/history", protect, getROIHistory);
router.post("/sample", protect, createSampleROI);

module.exports = router;