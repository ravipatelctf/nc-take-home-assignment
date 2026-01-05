import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Wallet balances
    walletBalance: {
      type: Number,
      default: 0,
    },

    totalInvestment: {
      type: Number,
      default: 0,
    },

    totalROI: {
      type: Number,
      default: 0,
    },

    totalReferralIncome: {
      type: Number,
      default: 0,
    },

    // Referral system
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    referralLevel: {
      type: Number,
      default: 0, // root user = 0
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export const User = mongoose.model("User", userSchema);
