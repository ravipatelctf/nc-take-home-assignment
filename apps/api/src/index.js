import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { initializeDatabase } from "./db/db.connect.js"

import authRoutes from "./routes/auth.routes.js"
import investmentRoutes from "./routes/investment.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"
import referralRoutes from "./routes/referral.routes.js"
import { calculateDailyROI } from "./services/roi.service.js"
import { startDailyRoiCron } from "./cron/dailyRoi.cron.js"

dotenv.config()

await initializeDatabase();

if (process.env.ENABLE_CRON === "true") {
  startDailyRoiCron()
}

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "Welcome to API server of nc take home assignment." })
})

app.get("/health", (req, res) => {
  res.json({ status: "API running" })
})

app.use("/auth", authRoutes)
app.use("/investments", investmentRoutes)
app.use("/dashboard", dashboardRoutes)
app.use("/referrals", referralRoutes)

app.post("/test/run-roi", async (req, res) => {
  await calculateDailyROI()
  res.json({ message: "ROI calculated" })
})


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`)
})
