import express from "express"
import { auth } from "../middleware/auth.middleware.js"
import { User } from "../models/User.model.js"

const router = express.Router()

async function buildTree(userId) {
  const children = await User.find({ referrer: userId }).lean()

  return Promise.all(
    children.map(async (child) => ({
      _id: child._id,
      name: child.name,
      referrals: await buildTree(child._id),
    }))
  )
}

router.get("/tree", auth, async (req, res) => {
  const tree = await buildTree(req.user.userId)
  res.json(tree)
})

export default router
