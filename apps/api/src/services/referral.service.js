import { User } from "../models/User.model.js"
import { ReferralIncome } from "../models/ReferralIncome.model.js"

const LEVEL_PERCENTAGES = {
  1: 5,
  2: 3,
  3: 1,
}

export async function distributeReferralIncome(
  user,
  roiAmount,
  investmentId
) {
  let currentUser = user
  let level = 1

  while (currentUser.referrer && LEVEL_PERCENTAGES[level]) {
    const referrer = await User.findById(currentUser.referrer)

    if (!referrer) break

    const percentage = LEVEL_PERCENTAGES[level]
    const income = (roiAmount * percentage) / 100

    // Save referral income
    await ReferralIncome.create({
      fromUser: user._id,
      toUser: referrer._id,
      investment: investmentId,
      level,
      amount: income,
    })

    // Credit referrer
    await User.findByIdAndUpdate(referrer._id, {
      $inc: {
        walletBalance: income,
        totalReferralIncome: income,
      },
    })

    currentUser = referrer
    level++
  }
}
