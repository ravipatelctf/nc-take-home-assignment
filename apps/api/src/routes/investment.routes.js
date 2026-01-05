import express from "express"
import { Investment } from "../models/Investment.model.js"
import { User } from "../models/User.model.js"
import { auth } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/", auth, async (req, res) => {
  const { amount, plan, roiPercentage, durationDays } = req.body

  const investment = await Investment.create({
    user: req.user.userId,
    amount,
    plan,
    roiPercentage,
    startDate: new Date(),
    endDate: new Date(Date.now() + durationDays * 86400000),
  })

  await User.findByIdAndUpdate(req.user.userId, {
    $inc: { totalInvestment: amount },
  })

  res.status(201).json(investment)
})

router.get("/me", auth, async (req, res) => {
  const investments = await Investment.find({
    user: req.user.userId,
  }).sort({ createdAt: -1 })

  res.json(investments)
})

export default router
