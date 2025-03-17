import Interview from '../models/Interview.js'
import User from '../models/User.js'
import { auth } from "../config/firebase.js"

class InterviewsController {

  static async getTrendingInterviews(req, res) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      let trendingInterviews = await Interview.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        {
          $addFields: {
            trendingScore: {
              $add: [
                { $multiply: ["$likes", 2] }, // Likes have more weight
                "$comments"
              ]
            }
          }
        },
        {
          $sort: { trendingScore: -1 }
        },
        {
          $limit: 10
        }
      ]);

      // Convert ObjectId to string for proper mapping
      const authorIds = trendingInterviews.map((interview) => interview.authorId?.toString());


      // Fetch user avatars
      const users = await User.find(
        { uid: { $in: authorIds } },
        { uid: 1, photoURL: 1 }
      ).lean();


      // Create a map of user avatars
      const userAvatarMap = {};
      users.forEach((user) => {
        userAvatarMap[user.uid.toString()] = user.photoURL;
      });

      // Attach avatar URLs to interviews
      trendingInterviews = trendingInterviews.map((interview) => ({
        ...interview,
        authorAvatar: userAvatarMap[interview.authorId?.toString()] || null
      }));

      res.status(200).json(trendingInterviews);
    } catch (error) {
      console.error("Error fetching trending interviews:", error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }


  static async getInterviews(req, res) {
    try {
      const { company, role, level, tags } = req.query;

      let filter = { status: "published" };

      if (company) filter.company = new RegExp(company, "i");
      if (role) filter.role = new RegExp(role, "i");
      if (level) filter.level = new RegExp(level, "i");
      if (tags) filter.tags = { $in: tags.split(",") };

      let interviews = await Interview.find(filter)
        .select("company role level tags authorId createdAt likes views authorName comments") // ✅ Fetch only required fields
        .sort({ createdAt: -1 })
        .lean();

      const authorIds = interviews.map((interview) => interview.authorId);
      const users = await User.find({ uid: { $in: authorIds } }, { uid: 1, photoURL: 1 }).lean();

      const userAvatarMap = {};
      users.forEach((user) => {
        userAvatarMap[user.uid] = user.photoURL;
      });

      interviews = interviews.map((interview) => ({
        ...interview,
        authorAvatar: userAvatarMap[interview.authorId]
      }));

      res.status(200).json(interviews);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async userInterviews(req, res) {
    try {
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
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({
        message: 'An error occurred while retrieving the profile',
        error: error.message || 'Unknown error'
      });
    }
  }
  static async interviewById(req, res) {
    try {
      const { id } = req.params;
      let interview = await Interview.findById(id).lean(); // ✅ Convert to plain JS object

      if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
      }

      // ✅ Fetch user avatar using authorId
      const user = await User.findOne({ uid: interview.authorId }, { photoURL: 1 }).lean();
      const authorAvatar = user?.photoURL || "https://cdn.example.com/default-avatar.png";

      // ✅ Add `authorAvatar` key in response
      interview = { ...interview, authorAvatar };

      // ✅ Increment view count
      await Interview.findByIdAndUpdate(id, { $inc: { views: 1 } });

      return res.status(200).json(interview);
    } catch (error) {
      console.error("Get interview error:", error);
      return res.status(500).json({ message: "Failed to fetch interview" });
    }
  }

  static async createInterview(req, res) {
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
  }

  static async likeInterview(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = authHeader.split("Bearer ")[1];
      const decodedToken = await auth.verifyIdToken(token);
      const userId = decodedToken.uid;

      const { id } = req.params;
      const interview = await Interview.findById(id);

      if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
      }

      if (interview.likedBy.includes(userId)) {

        interview.likes -= 1;
        interview.likedBy = interview.likedBy.filter((uid) => uid !== userId);
      } else {
        interview.likes += 1;
        interview.likedBy.push(userId);
      }

      await interview.save();
      return res.status(200).json({ message: "Like updated", likes: interview.likes });
    } catch (error) {
      console.error("Like error:", error);
      return res.status(500).json({ message: "Failed to update like" });
    }
  }


  static async deleteInterview(req, res) {
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
  }

  // Preference for male and female
  static async updateInterview(req, res) {
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

  }
}

export default InterviewsController;
