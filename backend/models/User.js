const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
   role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
},
    referralCode: {
      type: String,
      unique: true,
      required: true,
    },

    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    walletBalance: {
      type: Number,
      default: 0,
    },

    totalROIEarned: {
      type: Number,
      default: 0,
    },

    totalLevelIncomeEarned: {
      type: Number,
      default: 0,
    },
     emailVerified: {
      type: Boolean,
      default: false,
      },

    mobileVerified: {
      type: Boolean,
      default: false,
      }, 
      twoFactorEnabled: {
  type: Boolean,
  default: false,
},

bankName: {
  type: String,
  default: "",
},

accountHolderName: {
  type: String,
  default: "",
},

accountNumber: {
  type: String,
  default: "",
},

ifscCode: {
  type: String,
  default: "",
},

upiId: {
  type: String,
  default: "",
},

resetPasswordToken: {
  type: String,
},

resetPasswordExpires: {
  type: Date,
},

accountStatus: {
  type: String,
  enum: ["Active", "Inactive", "Blocked"],
  default: "Active",
},
  },    
  {
    timestamps: true,
  }
  );


module.exports = mongoose.model("User", userSchema);