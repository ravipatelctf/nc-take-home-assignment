import cron from "node-cron"
import { calculateDailyROI } from "../services/roi.service.js"

export function startDailyRoiCron() {
  // Runs every day at 00:00 (midnight)
  cron.schedule("0 0 * * *", async () => {
    console.log("Daily ROI cron started")

    try {
      await calculateDailyROI()
      console.log("Daily ROI cron completed")
    } catch (error) {
      console.error("Daily ROI cron failed", error)
    }
  })
}
