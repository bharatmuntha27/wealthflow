const express = require("express");
const dotenv = require("dotenv");

const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const referralRoutes = require("./routes/referralRoutes");
const roiRoutes = require("./routes/roiRoutes");
const referralIncomeRoutes = require("./routes/referralIncomeRoutes");
const walletRoutes = require("./routes/walletRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");
const withdrawRoutes =require("./routes/withdrawRoutes");

// ROI Cron
require("./cron/roiCron");

// ROI Service
const { processDailyROI } = require("./services/roiService");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://wealthflow-seven.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Database Connection
connectDB();

// Default Route
app.get("/", (req, res) => {
  res.send("WealthFlow API is running...");
});

// Test Route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API test route working",
  });
});


// Manual ROI Run Route (Testing)
app.get("/api/roi/run", async (req, res) => {
  try {
    await processDailyROI();

    res.json({
      success: true,
      message: "ROI Process Executed Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/roi", roiRoutes);
app.use("/api/referral-income", referralIncomeRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/withdraw", withdrawRoutes);
// app.use("/api/payment", paymentRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});