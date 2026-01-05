import express from "express"
import { auth } from "../middleware/auth.middleware.js"
import { User } from "../models/User.model.js"
import { Investment } from "../models/Investment.model.js"
import { ROIHistory } from "../models/ROIHistory.model.js"

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

router.get("/daily-roi", auth, async (req, res) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const result = await ROIHistory.aggregate([
    {
      $match: {
        user: req.user.userId,
        date: today,
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$roiAmount" },
      },
    },
  ])

  res.json({
    dailyROI: result[0]?.total || 0,
  })
})

router.get("/roi-history", auth, async (req, res) => {
  const history = await ROIHistory.find(
    { user: req.user.userId },
    { date: 1, roiAmount: 1, _id: 0 }
  ).sort({ date: 1 })

  res.json(history)
})


export default router
