import express from "express"
import { auth } from "../middleware/auth.middleware.js"
import { User } from "../models/User.model.js"
import { Investment } from "../models/Investment.model.js"

const router = express.Router()

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.userId).lean()

  const investments = await Investment.find({
    user: user._id,
  }).lean()

  res.json({
    walletBalance: user.walletBalance,
    totalInvestment: user.totalInvestment,
    totalROI: user.totalROI,
    totalReferralIncome: user.totalReferralIncome,
    investments,
  })
})

export default router
