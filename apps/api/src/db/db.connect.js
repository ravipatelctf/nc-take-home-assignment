import mongoose from "mongoose"

export async function initializeDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to database successfully.")
  } catch (error) {
    console.error("MongoDB connection error:", error.message)
    throw new Error("Failed to connect to database")
  }
}
