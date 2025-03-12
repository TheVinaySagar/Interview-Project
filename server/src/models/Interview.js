import mongoose from "mongoose"

const interviewSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
        enum: ["internship", "fresher", "experienced"],
    },
    questions: [
        {
            question: { type: String, required: true },
            answer: { type: String, required: true },
        }
    ],
    experience: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        required: true,
    },
    isAnonymous: {
        type: Boolean,
        default: false,
    },
    authorId: {
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["draft", "published", "flagged"],
        default: "published",
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model("Interview", interviewSchema)
