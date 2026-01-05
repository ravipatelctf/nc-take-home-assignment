import { Investment } from "../models/Investment.model.js"
import { ROIHistory } from "../models/ROIHistory.model.js"
import { User } from "../models/User.model.js"
import { distributeReferralIncome } from "./referral.service.js"

function startOfDay(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export async function calculateDailyROI() {
  const today = startOfDay()

  // ✅ 1. Close expired investments FIRST
  await Investment.updateMany(
    {
      status: "ACTIVE",
      endDate: { $lt: today },
    },
    { status: "COMPLETED" }
  )

  // ✅ 2. Fetch active investments
  const investments = await Investment.find({
    status: "ACTIVE",
    endDate: { $gte: today },
  }).populate("user")

  for (const investment of investments) {
    const { user } = investment

    // ✅ 3. Idempotency check
    const exists = await ROIHistory.findOne({
      investment: investment._id,
      date: today,
    })

    if (exists) continue

    const roiAmount =
      investment.amount * (investment.roiPercentage / 100)

    // ✅ 4. Save ROI history
    await ROIHistory.create({
      user: user._id,
      investment: investment._id,
      date: today,
      roiAmount,
    })

    // ✅ 5. Credit user wallet
    await User.findByIdAndUpdate(user._id, {
      $inc: {
        walletBalance: roiAmount,
        totalROI: roiAmount,
      },
    })

    // ✅ 6. Referral income
    await distributeReferralIncome(
      user,
      roiAmount,
      investment._id
    )
  }
}
