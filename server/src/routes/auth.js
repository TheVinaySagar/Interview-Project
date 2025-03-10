import express from "express"
import { auth } from "../config/firebase.js"
import User from "../models/User.js"

const router = express.Router()

// Create or update user in MongoDB
router.post("/user", async (req, res) => {
    try {
        // Verify authentication
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const token = authHeader.split("Bearer ")[1]
        const decodedToken = await auth.verifyIdToken(token)

        // Get user from Firebase
        const userRecord = await auth.getUser(decodedToken.uid)

        // Check if user exists in MongoDB
        let user = await User.findOne({ uid: userRecord.uid })

        if (user) {
            // Update existing user
            user.email = userRecord.email || ""
            user.displayName = userRecord.displayName || "User"
            user.photoURL = userRecord.photoURL || ""
            user.updatedAt = new Date()
            await user.save()
        } else {
            // Create new user
            user = new User({
                uid: userRecord.uid,
                email: userRecord.email || "",
                displayName: userRecord.displayName || "User",
                photoURL: userRecord.photoURL || "",
            })
            await user.save()
        }

        return res.status(200).json({ user })
    } catch (error) {
        console.error("User sync error:", error)
        return res.status(500).json({ message: "Failed to sync user data" })
    }
})

// Verify user token
router.post("/verify-token", async (req, res) => {
    try {
        const { token } = req.body
        if (!token) {
            return res.status(400).json({ message: "Token is required" })
        }

        const decodedToken = await auth.verifyIdToken(token)
        return res.status(200).json({ user: decodedToken })
    } catch (error) {
        console.error("Token verification error:", error)
        return res.status(401).json({ message: "Invalid token" })
    }
})

// Get user data
router.get("/user/:uid", async (req, res) => {
    try {
        const { uid } = req.params
        console.log(uid)
        // Get user from MongoDB
        const user = await User.findOne({ uid })
        console.log("User is found")
        if (!user) {
            // If not in MongoDB, try to get from Firebase
            const userRecord = await auth.getUser(uid)
            console.log("Fuck you")
            return res.status(200).json({ user: userRecord })
        }

        return res.status(200).json({ user })
    } catch (error) {
        console.error("Get user error:", error)
        return res.status(404).json({ message: "User not found" })
    }
})

export default router
