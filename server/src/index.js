import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import dotenv from "dotenv"
import mongoose from "mongoose"
import { auth } from "./config/firebase.js"
import authRoutes from "./routes/auth.js"
import interviewRoutes from "./routes/interviews.js"
import userRoutes from "./routes/users.js"
import chatRoutes from "./routes/chat.js"

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err))

// Middleware
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())

// Authentication middleware
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const token = authHeader.split("Bearer ")[1]
        const decodedToken = await auth.verifyIdToken(token)
        req.user = decodedToken
        next()
    } catch (error) {
        console.error("Authentication error:", error)
        return res.status(401).json({ message: "Unauthorized" })
    }
}

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/interviews", interviewRoutes)
app.use("/api/users", authenticateUser, userRoutes)
app.use("/api/chat", authenticateUser, chatRoutes)

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" })
})

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
