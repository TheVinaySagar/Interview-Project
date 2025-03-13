import express from "express"
import { auth } from "../config/firebase.js"
import Interview from "../models/Interview.js"
import User from "../models/User.js"

const router = express.Router()

// Get all interviews
router.get("/", async (req, res) => {
  try {
    const { company, role, level, tags } = req.query;

    let filter = { status: "published" }; // ✅ Ensure only published interviews are fetched

    if (company) filter.company = new RegExp(company, "i"); // ✅ Case-insensitive search
    if (role) filter.role = new RegExp(role, "i");
    if (level) filter.level = new RegExp(level, "i");
    if (tags) filter.tags = { $in: tags.split(",") }; // ✅ Match any tag instead of all

    const interviews = await Interview.find(filter).sort({ createdAt: -1 });
    res.status(200).json(interviews);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/user-interviews", async (req, res) => {
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
  const interviews = await Interview.find({ authorId: user.uid }).sort({ createdAt: -1 })

  return res.status(200).json(interviews)
})


// Get interview by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const interview = await Interview.findById(id)

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" })
    }

    // Increment view count
    interview.views += 1
    await interview.save()

    return res.status(200).json(interview)
  } catch (error) {
    console.error("Get interview error:", error)
    return res.status(500).json({ message: "Failed to fetch interview" })
  }
})

// Create new interview
router.post("/", async (req, res) => {
  try {
    // Verify authentication
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await auth.verifyIdToken(token)
    const userId = decodedToken.uid

    // Get user from MongoDB
    const user = await User.findOne({ uid: userId })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const { company, role, level, questions, experience, tags, isAnonymous } = req.body

    // Validate required fields
    if (!company || !role || !level || !questions || !experience || !tags) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Ensure `questions` is correctly structured
    if (!Array.isArray(questions) || !questions.every(q => q.question && q.answer)) {
      return res.status(400).json({ message: "Invalid questions format. Each question must have a 'question' and 'answer' field." })
    }

    const newInterview = new Interview({
      company,
      role,
      level,
      questions: questions.map(q => ({ question: q.question, answer: q.answer })),
      experience,
      tags,
      isAnonymous,
      authorId: userId,
      authorName: isAnonymous ? "Anonymous" : user.displayName,
    })

    await newInterview.save()

    return res.status(201).json(newInterview)
  } catch (error) {
    console.error("Create interview error:", error)

    // Improved error response
    const errorMessage = error.message || "Failed to create interview"
    return res.status(500).json({ message: errorMessage })
  }
})

// Update interview
router.put("/:id", async (req, res) => {
  try {
    // Verify authentication
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await auth.verifyIdToken(token)
    const userId = decodedToken.uid

    const { id } = req.params
    const interview = await Interview.findById(id)

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" })
    }

    // Check if user is the author
    if (interview.authorId !== userId) {
      return res.status(403).json({ message: "Not authorized to update this interview" })
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    }

    const updatedInterview = await Interview.findByIdAndUpdate(id, updateData, { new: true })

    return res.status(200).json(updatedInterview)
  } catch (error) {
    console.error("Update interview error:", error)
    return res.status(500).json({ message: "Failed to update interview" })
  }
})

// Delete interview
router.delete("/:id", async (req, res) => {
  try {
    // Verify authentication
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await auth.verifyIdToken(token)
    const userId = decodedToken.uid

    const { id } = req.params
    const interview = await Interview.findById(id)

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" })
    }

    // Check if user is the author
    if (interview.authorId !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this interview" })
    }

    await Interview.findByIdAndDelete(id)

    return res.status(200).json({ message: "Interview deleted successfully" })
  } catch (error) {
    console.error("Delete interview error:", error)
    return res.status(500).json({ message: "Failed to delete interview" })
  }
})

export default router
