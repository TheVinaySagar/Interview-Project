// import express from "express";
// import { auth } from "../config/firebase.js";
// import Comment from "../models/Comment.js";

// const router = express.Router();

// // ✅ Get All Comments for an Interview
// router.get("/:interviewId", async (req, res) => {
//   try {
//     const { interviewId } = req.params;
//     const comments = await Comment.find({ interviewId }).sort({ createdAt: -1 });
//     res.status(200).json(comments);
//   } catch (error) {
//     console.error("Get comments error:", error);
//     res.status(500).json({ message: "Failed to fetch comments" });
//   }
// });

// // ✅ Post a New Comment or Reply
// router.post("/", async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const token = authHeader.split("Bearer ")[1];
//     const decodedToken = await auth.verifyIdToken(token);
//     const { interviewId, content, parentCommentId } = req.body;

//     if (!interviewId || !content.trim()) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const newComment = new Comment({
//       interviewId,
//       authorId: decodedToken.uid,
//       authorName: decodedToken.name || "Anonymous",
//       authorAvatar: decodedToken.picture || "",
//       content,
//       parentCommentId: parentCommentId || null,
//     });

//     await newComment.save();
//     res.status(201).json(newComment);
//   } catch (error) {
//     console.error("Post comment error:", error);
//     res.status(500).json({ message: "Failed to post comment" });
//   }
// });

// // ✅ Edit a Comment
// router.put("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { content } = req.body;

//     if (!content.trim()) {
//       return res.status(400).json({ message: "Content cannot be empty" });
//     }

//     const comment = await Comment.findById(id);
//     if (!comment) {
//       return res.status(404).json({ message: "Comment not found" });
//     }

//     comment.content = content;
//     await comment.save();

//     res.status(200).json(comment);
//   } catch (error) {
//     console.error("Edit comment error:", error);
//     res.status(500).json({ message: "Failed to edit comment" });
//   }
// });

// // ✅ Delete a Comment
// router.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const comment = await Comment.findById(id);

//     if (!comment) {
//       return res.status(404).json({ message: "Comment not found" });
//     }

//     await Comment.findByIdAndDelete(id);
//     res.status(200).json({ message: "Comment deleted successfully" });
//   } catch (error) {
//     console.error("Delete comment error:", error);
//     res.status(500).json({ message: "Failed to delete comment" });
//   }
// });

// // ✅ Like a Comment
// router.post("/:id/like", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const comment = await Comment.findById(id);

//     if (!comment) {
//       return res.status(404).json({ message: "Comment not found" });
//     }

//     comment.likes += 1;
//     await comment.save();

//     res.status(200).json({ likes: comment.likes });
//   } catch (error) {
//     console.error("Like comment error:", error);
//     res.status(500).json({ message: "Failed to like comment" });
//   }
// });

// export default router;



// import express from "express";
// const router = express.Router();
// import Comment from "../models/Comment.js";
// import Like from "../models/Like.js";
// // import { authMiddleware } from "../middlewares/auth.js";
// import mongoose from "mongoose";

// // Get all comments for an interview
// router.get('/:interviewId', async (req, res) => {
//   try {
//     const { interviewId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(interviewId)) {
//       return res.status(400).json({ message: "Invalid interview ID format" });
//     }

//     const comments = await Comment.find({
//       interviewId,
//       isDeleted: false
//     }).sort({ createdAt: -1 });

//     return res.json(comments);
//   } catch (error) {
//     console.error('Error fetching comments:', error);
//     return res.status(500).json({ message: "Failed to fetch comments" });
//   }
// });

// // Create a new comment
// router.post('/', async (req, res) => {
//   try {
//     const { interviewId, content, parentCommentId } = req.body;
//     const user = req.user;

//     if (!interviewId || !content) {
//       return res.status(400).json({ message: "Interview ID and content are required" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(interviewId)) {
//       return res.status(400).json({ message: "Invalid interview ID format" });
//     }

//     if (parentCommentId && !mongoose.Types.ObjectId.isValid(parentCommentId)) {
//       return res.status(400).json({ message: "Invalid parent comment ID format" });
//     }

//     // Create the comment
//     const comment = new Comment({
//       interviewId,
//       authorId: user.uid,
//       author: {
//         name: user.displayName || 'Anonymous',
//         avatar: user.photoURL || '',
//         initials: user.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'
//       },
//       content,
//       parentCommentId: parentCommentId || null
//     });

//     await comment.save();

//     return res.status(201).json(comment);
//   } catch (error) {
//     console.error('Error creating comment:', error);
//     return res.status(500).json({ message: "Failed to create comment" });
//   }
// });

// // Update a comment
// router.put('/:commentId', async (req, res) => {
//   try {
//     const { commentId } = req.params;
//     const { content } = req.body;
//     const userId = req.user.uid;

//     if (!mongoose.Types.ObjectId.isValid(commentId)) {
//       return res.status(400).json({ message: "Invalid comment ID format" });
//     }

//     if (!content) {
//       return res.status(400).json({ message: "Content is required" });
//     }

//     // Find the comment
//     const comment = await Comment.findById(commentId);

//     if (!comment) {
//       return res.status(404).json({ message: "Comment not found" });
//     }

//     // Check if the user is the author of the comment
//     if (comment.authorId !== userId) {
//       return res.status(403).json({ message: "You are not authorized to edit this comment" });
//     }

//     // Update the comment
//     comment.content = content;
//     comment.isEdited = true;
//     await comment.save();

//     return res.json(comment);
//   } catch (error) {
//     console.error('Error updating comment:', error);
//     return res.status(500).json({ message: "Failed to update comment" });
//   }
// });

// // Delete a comment
// router.delete('/:commentId', async (req, res) => {
//   try {
//     const { commentId } = req.params;
//     const userId = req.user.uid;

//     if (!mongoose.Types.ObjectId.isValid(commentId)) {
//       return res.status(400).json({ message: "Invalid comment ID format" });
//     }

//     // Find the comment
//     const comment = await Comment.findById(commentId);

//     if (!comment) {
//       return res.status(404).json({ message: "Comment not found" });
//     }

//     // Check if the user is the author of the comment
//     if (comment.authorId !== userId) {
//       return res.status(403).json({ message: "You are not authorized to delete this comment" });
//     }

//     // Soft delete: mark as deleted instead of removing from DB
//     comment.isDeleted = true;
//     await comment.save();

//     return res.json({ message: "Comment deleted successfully" });
//   } catch (error) {
//     console.error('Error deleting comment:', error);
//     return res.status(500).json({ message: "Failed to delete comment" });
//   }
// });

// // Like a comment
// router.post('/:commentId/like', async (req, res) => {
//   try {
//     const { commentId } = req.params;
//     const userId = req.user.uid;

//     if (!mongoose.Types.ObjectId.isValid(commentId)) {
//       return res.status(400).json({ message: "Invalid comment ID format" });
//     }

//     // Find the comment
//     const comment = await Comment.findById(commentId);

//     if (!comment) {
//       return res.status(404).json({ message: "Comment not found" });
//     }

//     // Check if user already liked this comment
//     const existingLike = await Like.findOne({ commentId, userId });

//     if (existingLike) {
//       return res.status(400).json({ message: "You've already liked this comment" });
//     }

//     // Create a new like
//     const like = new Like({
//       commentId,
//       userId
//     });

//     await like.save();

//     // Increment like count on the comment
//     comment.likes += 1;
//     comment.likedBy.push(userId);
//     await comment.save();

//     return res.json({ likes: comment.likes });
//   } catch (error) {
//     console.error('Error liking comment:', error);
//     return res.status(500).json({ message: "Failed to like comment" });
//   }
// });

// export default router;


// import express from "express";
// const router = express.Router();
// import Comment from "../models/Comment.js";
// import Like from "../models/Like.js";
// import mongoose from "mongoose";
// import { auth } from "../config/firebase.js"; // Import Firebase auth

// // Authentication middleware
// const authMiddleware = async (req, res, next) => {
//   try {
//     // Get token from header
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Unauthorized: No token provided" });
//     }

//     // Verify token
//     const token = authHeader.split("Bearer ")[1];
//     const decodedToken = await auth.verifyIdToken(token);

//     // Set user info in request object
//     req.user = {
//       uid: decodedToken.uid,
//       email: decodedToken.email,
//       displayName: decodedToken.name || "Anonymous",
//       photoURL: decodedToken.picture || ""
//     };

//     next();
//   } catch (error) {
//     console.error("Authentication error:", error);
//     res.status(401).json({ message: "Unauthorized: Invalid token" });
//   }
// };

// // Get all comments for an interview (no auth required for reading)
// router.get('/:interviewId', async (req, res) => {
//   try {
//     const { interviewId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(interviewId)) {
//       return res.status(400).json({ message: "Invalid interview ID format" });
//     }

//     const comments = await Comment.find({
//       interviewId,
//       isDeleted: false
//     }).sort({ createdAt: -1 });

//     return res.json(comments);
//   } catch (error) {
//     console.error('Error fetching comments:', error);
//     return res.status(500).json({ message: "Failed to fetch comments" });
//   }
// });

// // Create a new comment - add authMiddleware
// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     const { interviewId, content, parentCommentId } = req.body;
//     const user = req.user; // Now this will be defined

//     if (!interviewId || !content) {
//       return res.status(400).json({ message: "Interview ID and content are required" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(interviewId)) {
//       return res.status(400).json({ message: "Invalid interview ID format" });
//     }

//     if (parentCommentId && !mongoose.Types.ObjectId.isValid(parentCommentId)) {
//       return res.status(400).json({ message: "Invalid parent comment ID format" });
//     }

//     // Create the comment
//     const comment = new Comment({
//       interviewId,
//       authorId: user.uid,
//       authorName: user.displayName || 'Anonymous',
//       authorPhotoURL: user.photoURL || '',
//       content: content.trim(),
//       parentCommentId: parentCommentId || null,
//       likes: 0
//     });

//     await comment.save();
//     return res.status(201).json(comment);
//   } catch (error) {
//     console.error('Error creating comment:', error);
//     return res.status(500).json({ message: "Failed to create comment" });
//   }
// });

// // Update a comment - add authMiddleware
// router.put('/:commentId', authMiddleware, async (req, res) => {
//   try {
//     const { commentId } = req.params;
//     const { content } = req.body;
//     const userId = req.user.uid;

//     if (!mongoose.Types.ObjectId.isValid(commentId)) {
//       return res.status(400).json({ message: "Invalid comment ID format" });
//     }

//     if (!content) {
//       return res.status(400).json({ message: "Content is required" });
//     }

//     // Find the comment
//     const comment = await Comment.findById(commentId);

//     if (!comment) {
//       return res.status(404).json({ message: "Comment not found" });
//     }

//     // Check if the user is the author of the comment
//     if (comment.authorId !== userId) {
//       return res.status(403).json({ message: "You are not authorized to edit this comment" });
//     }

//     // Update the comment
//     comment.content = content.trim();
//     comment.isEdited = true;
//     await comment.save();

//     return res.json(comment);
//   } catch (error) {
//     console.error('Error updating comment:', error);
//     return res.status(500).json({ message: "Failed to update comment" });
//   }
// });

// // Delete a comment - add authMiddleware
// router.delete('/:commentId', authMiddleware, async (req, res) => {
//   try {
//     const { commentId } = req.params;
//     const userId = req.user.uid;

//     if (!mongoose.Types.ObjectId.isValid(commentId)) {
//       return res.status(400).json({ message: "Invalid comment ID format" });
//     }

//     // Find the comment
//     const comment = await Comment.findById(commentId);

//     if (!comment) {
//       return res.status(404).json({ message: "Comment not found" });
//     }

//     // Check if the user is the author of the comment
//     if (comment.authorId !== userId) {
//       return res.status(403).json({ message: "You are not authorized to delete this comment" });
//     }

//     // Soft delete: mark as deleted instead of removing from DB
//     comment.isDeleted = true;
//     await comment.save();

//     return res.json({ message: "Comment deleted successfully" });
//   } catch (error) {
//     console.error('Error deleting comment:', error);
//     return res.status(500).json({ message: "Failed to delete comment" });
//   }
// });

// // Like a comment - add authMiddleware
// router.post('/:commentId/like', authMiddleware, async (req, res) => {
//   try {
//     const { commentId } = req.params;
//     const userId = req.user.uid;

//     if (!mongoose.Types.ObjectId.isValid(commentId)) {
//       return res.status(400).json({ message: "Invalid comment ID format" });
//     }

//     // Find the comment
//     const comment = await Comment.findById(commentId);

//     if (!comment) {
//       return res.status(404).json({ message: "Comment not found" });
//     }

//     // Check if user already liked this comment
//     const existingLike = await Like.findOne({ commentId, userId });

//     if (existingLike) {
//       return res.status(400).json({ message: "You've already liked this comment" });
//     }

//     // Create a new like
//     const like = new Like({
//       commentId,
//       userId
//     });

//     await like.save();

//     // Increment like count on the comment
//     comment.likes += 1;
//     if (!comment.likedBy) {
//       comment.likedBy = [];
//     }
//     comment.likedBy.push(userId);
//     await comment.save();

//     return res.json({ likes: comment.likes });
//   } catch (error) {
//     console.error('Error liking comment:', error);
//     return res.status(500).json({ message: "Failed to like comment" });
//   }
// });

// export default router;


import express from "express";
import Comment from "../models/Comment.js";
import mongoose from "mongoose";
import { auth } from "../config/firebase.js";
import Interview from "../models/Interview.js";

const router = express.Router();

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);

    // Set user info in request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name || decodedToken.email?.split('@')[0] || "Anonymous",
      photoURL: decodedToken.picture || ""
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Get all comments for an interview
router.get('/:interviewId', async (req, res) => {
  try {
    const { interviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({ message: "Invalid interview ID format" });
    }

    // Use the static method we defined in the schema
    const comments = await Comment.getInterviewComments(interviewId, {
      limit: Number(req.query.limit) || 50,
      skip: Number(req.query.skip) || 0
    });

    return res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ message: "Failed to fetch comments" });
  }
});

// Create a new comment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { interviewId, content, parentCommentId } = req.body;
    const user = req.user;

    if (!interviewId || !content) {
      return res.status(400).json({ message: "Interview ID and content are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({ message: "Invalid interview ID format" });
    }

    if (parentCommentId && !mongoose.Types.ObjectId.isValid(parentCommentId)) {
      return res.status(400).json({ message: "Invalid parent comment ID format" });
    }

    // Get interview author ID to check if the comment author is the interview author
    let isAuthor = false;
    try {
      const interview = await mongoose.model('Interview').findById(interviewId);
      isAuthor = interview && interview.authorId === user.uid;
    } catch (err) {
      // Ignore error, isAuthor will remain false
      console.log("Error checking if user is author:", err);
    }

    // Create the comment
    const comment = new Comment({
      interviewId,
      authorId: user.uid,
      author: {
        name: user.displayName || 'Anonymous',
        avatar: user.photoURL || '',
        // Generate initials automatically using the schema default function
      },
      content: content.trim(),
      parentCommentId: parentCommentId || null,
      isAuthor: isAuthor
    });

    await comment.save();
    await Interview.findByIdAndUpdate(interviewId, { $inc: { comments: 1 } });
    return res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.status(500).json({ message: "Failed to create comment" });
  }
});

// Update a comment
router.put('/:commentId', authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.uid;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID format" });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Find the comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user is authorized to edit this comment
    if (!comment.canModify(userId)) {
      return res.status(403).json({ message: "You are not authorized to edit this comment" });
    }

    // Update the comment
    comment.content = content.trim();
    comment.isEdited = true;
    await comment.save();

    return res.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return res.status(500).json({ message: "Failed to update comment" });
  }
});

// Delete a comment
router.delete('/:commentId', authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.uid;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID format" });
    }

    // Find the comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user is authorized to delete this comment
    if (!comment.canModify(userId)) {
      return res.status(403).json({ message: "You are not authorized to delete this comment" });
    }

    // Soft delete the comment
    comment.isDeleted = true;
    await comment.save();
    return res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ message: "Failed to delete comment" });
  }
});

// Like a comment
router.post('/:commentId/like', authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.uid;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID format" });
    }

    // Find the comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user has already liked this comment
    if (comment.likedBy && comment.likedBy.includes(userId)) {
      return res.status(400).json({ message: "You've already liked this comment" });
    }

    // Add the user to the likedBy array and increment the likes count
    comment.likes += 1;
    if (!comment.likedBy) {
      comment.likedBy = [];
    }
    comment.likedBy.push(userId);

    await comment.save();

    return res.json({ likes: comment.likes });
  } catch (error) {
    console.error('Error liking comment:', error);
    return res.status(500).json({ message: "Failed to like comment" });
  }
});

// Unlike a comment (bonus feature)
router.post('/:commentId/unlike', authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.uid;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID format" });
    }

    // Find the comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user has liked this comment
    if (!comment.likedBy || !comment.likedBy.includes(userId)) {
      return res.status(400).json({ message: "You haven't liked this comment" });
    }

    // Remove the user from the likedBy array and decrement the likes count
    comment.likes = Math.max(0, comment.likes - 1); // Ensure likes doesn't go below 0
    comment.likedBy = comment.likedBy.filter(id => id !== userId);

    await comment.save();

    return res.json({ likes: comment.likes });
  } catch (error) {
    console.error('Error unliking comment:', error);
    return res.status(500).json({ message: "Failed to unlike comment" });
  }
});

// Get replies for a comment
router.get('/:commentId/replies', async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID format" });
    }

    const replies = await Comment.find({
      parentCommentId: commentId,
      isDeleted: false
    }).sort({ createdAt: 1 });

    return res.json(replies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    return res.status(500).json({ message: "Failed to fetch replies" });
  }
});

export default router;
