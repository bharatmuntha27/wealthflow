const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Settings = require("../models/Settings");

const seedAdmin = async () => {
  try {
    // 1. Seed default admin user
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("AdminPassword123", 10);
      await User.create({
        fullName: "WealthFlow Admin",
        email: "admin@wealthflow.com",
        mobileNumber: "9999999999",
        password: hashedPassword,
        role: "admin",
        referralCode: "ADMIN123",
        referredBy: null,
        emailVerified: true,
        mobileVerified: true,
        accountStatus: "Active",
      });
      console.log("SUCCESS: Default Admin user seeded (admin@wealthflow.com / AdminPassword123)");
    } else {
      console.log("INFO: Admin user already exists");
    }

    // 2. Seed default settings
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create({
        minDeposit: 500,
        maxDeposit: 500000,
        minWithdrawal: 100,
        dailyROIPercentage: 1,
        adminUpiId: "wealthflow@upi",
        adminBankName: "HDFC Bank",
        adminBankAccountHolder: "WealthFlow Pvt Ltd",
        adminBankAccountNumber: "123456789012",
        adminBankIfsc: "HDFC0001234",
      });
      console.log("SUCCESS: Default System Settings seeded");
    } else {
      console.log("INFO: System Settings already exist");
    }
  } catch (error) {
    console.error("WARNING: Seeding failed:", error.message);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Atlas Connected Successfully");
    await seedAdmin();
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;