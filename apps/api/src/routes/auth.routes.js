import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../models/User.model.js"

const router = express.Router()

router.post("/register", async (req, res) => {
  const { name, email, password, referrerId } = req.body

  const exists = await User.findOne({ email })
  if (exists) return res.status(400).json({ message: "Email exists" })

  const hashed = await bcrypt.hash(password, 10)

  let referrer = null
  let referralLevel = 0

  if (referrerId) {
    referrer = await User.findById(referrerId)
    referralLevel = referrer ? referrer.referralLevel + 1 : 0
  }

  const user = await User.create({
    name,
    email,
    password: hashed,
    referrer: referrer?._id || null,
    referralLevel,
  })

  res.status(201).json({ message: "Registered", userId: user._id })
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ message: "Invalid credentials" })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(400).json({ message: "Invalid credentials" })

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )

  res.json({ token })
})

export default router
