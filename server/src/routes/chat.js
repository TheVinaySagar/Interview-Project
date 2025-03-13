import express from "express"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { marked } from "marked"
const router = express.Router()

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Chat with AI
router.post("/", async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ message: "Message is required" })
    }

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Create a chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: "I'm preparing for job interviews. I need help with technical and behavioral questions.",
        },
        {
          role: "model",
          parts:
            "I'd be happy to help you prepare for job interviews! I can assist with both technical and behavioral questions. What specific role or company are you interviewing for?",
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    })

    // Send message and get response
    const result = await chat.sendMessage(message)
    const response = result.response.text()
    // const parsedresponse = marked(response)

    return res.status(200).json({ response })
  } catch (error) {
    console.error("Chat error:", error)
    return res.status(500).json({ message: "Failed to process chat message" })
  }
})

export default router
