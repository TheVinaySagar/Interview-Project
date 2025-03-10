import express from "express"
import Interview from "../models/Interview.js"
import User from "../models/User.js"
import { auth } from "../config/firebase.js"

const router = express.Router()

// Get user profile
router.get("/profile", async (req, res) => {
    try {
        const userId = req.user.uid

        // Get user from MongoDB
        const user = await User.findOne({ uid: userId })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Get user's interview stats
        const interviewCount = await Interview.countDocuments({ authorId: userId })
        const totalLikes = await Interview.aggregate([
            { $match: { authorId: userId } },
            { $group: { _id: null, total: { $sum: "$likes" } } },
        ])
        const totalComments = await Interview.aggregate([
            { $match: { authorId: userId } },
            { $group: { _id: null, total: { $sum: "$comments" } } },
        ])

        const stats = {
            interviewCount,
            totalLikes: totalLikes.length > 0 ? totalLikes[0].total : 0,
            totalComments: totalComments.length > 0 ? totalComments[0].total : 0,
            memberSince: user.createdAt,
        }

        return res.status(200).json({
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
            },
            stats,
        })
    } catch (error) {
        console.error("Get profile error:", error)
        return res.status(500).json({ message: "Failed to fetch profile" })
    }
})

// Get user's interviews
router.get("/interviews", async (req, res) => {
    try {
        const userId = req.user.uid

        const interviews = await Interview.find({ authorId: userId }).sort({ createdAt: -1 })

        return res.status(200).json({ interviews })
    } catch (error) {
        console.error("Get user interviews error:", error)
        return res.status(500).json({ message: "Failed to fetch interviews" })
    }
})

// Update user profile
router.put("/profile", async (req, res) => {
    try {
        const userId = req.user.uid
        const { displayName, bio } = req.body

        // Update user in MongoDB
        const user = await User.findOneAndUpdate(
            { uid: userId },
            {
                displayName: displayName || req.user.name,
                bio,
                updatedAt: new Date(),
            },
            { new: true },
        )

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({ user })
    } catch (error) {
        console.error("Update profile error:", error)
        return res.status(500).json({ message: "Failed to update profile" })
    }
})

router.get('/profile-data', (req, res) => {
    return res.status(200).json({
        name: req.user.name,
        email: req.user.email,
        photoURL: req.user.picture
    });
});


export default router
