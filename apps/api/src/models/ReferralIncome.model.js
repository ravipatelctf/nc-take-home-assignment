import mongoose from "mongoose"

const referralIncomeSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investment",
      required: true,
    },

    level: {
      type: Number,
      required: true, // Level 1, 2, 3...
    },

    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

export const ReferralIncome = mongoose.model(
  "ReferralIncome",
  referralIncomeSchema
)
