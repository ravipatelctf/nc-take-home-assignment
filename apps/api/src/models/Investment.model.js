import mongoose from "mongoose"

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    plan: {
      type: String,
      required: true, // e.g. BASIC, PREMIUM
    },

    roiPercentage: {
      type: Number,
      required: true, // e.g. 1 (% per day)
    },

    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "CANCELLED"],
      default: "ACTIVE",
      index: true,
    },
  },
  { timestamps: true }
)

export const Investment = mongoose.model("Investment", investmentSchema);
