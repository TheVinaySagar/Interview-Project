// "use client"

// import * as React from "react"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { ThumbsUp, Reply } from "lucide-react"

// // Mock data for comments
// const comments = [
//   {
//     id: 1,
//     author: {
//       name: "Sarah Miller",
//       avatar: "/placeholder.svg?height=40&width=40",
//       initials: "SM",
//     },
//     content:
//       "Thanks for sharing your experience! The system design question about URL shortener is particularly helpful as I'm preparing for a similar interview.",
//     date: "2 days ago",
//     likes: 8,
//   },
//   {
//     id: 2,
//     author: {
//       name: "John Doe",
//       avatar: "/placeholder.svg?height=40&width=40",
//       initials: "JD",
//     },
//     content: "Did they ask any questions about distributed systems or microservices architecture?",
//     date: "1 day ago",
//     likes: 3,
//   },
//   {
//     id: 3,
//     author: {
//       name: "Alex Johnson",
//       avatar: "/placeholder.svg?height=40&width=40",
//       initials: "AJ",
//     },
//     content:
//       "Yes, they did ask about microservices during the system design round. They wanted to know how I would handle inter-service communication and data consistency.",
//     date: "1 day ago",
//     likes: 5,
//     isAuthor: true,
//     replyTo: 2,
//   },
// ]

// export function InterviewComments() {
//   const [newComment, setNewComment] = React.useState("")

//   const handleSubmitComment = (e: React.FormEvent) => {
//     e.preventDefault()
//     // In a real app, this would submit the comment to the backend
//     setNewComment("")
//   }

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>

//       <form onSubmit={handleSubmitComment} className="space-y-4">
//         <Textarea
//           placeholder="Add a comment..."
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           className="min-h-[100px]"
//         />
//         <Button type="submit" disabled={!newComment.trim()}>
//           Post Comment
//         </Button>
//       </form>

//       <div className="space-y-6">
//         {comments.map((comment) => (
//           <div key={comment.id} className={`space-y-2 ${comment.replyTo ? "ml-12 border-l-2 pl-4 border-muted" : ""}`}>
//             <div className="flex items-start space-x-4">
//               <Avatar className="h-10 w-10">
//                 <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
//                 <AvatarFallback>{comment.author.initials}</AvatarFallback>
//               </Avatar>
//               <div className="flex-1 space-y-1">
//                 <div className="flex items-center">
//                   <span className="font-medium">{comment.author.name}</span>
//                   {comment.isAuthor && (
//                     <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Author</span>
//                   )}
//                   <span className="ml-2 text-xs text-muted-foreground">{comment.date}</span>
//                 </div>
//                 <p>{comment.content}</p>
//                 <div className="flex items-center space-x-4 pt-1">
//                   <Button variant="ghost" size="sm" className="h-8 px-2">
//                     <ThumbsUp className="mr-1 h-4 w-4" />
//                     <span>{comment.likes}</span>
//                   </Button>
//                   <Button variant="ghost" size="sm" className="h-8 px-2">
//                     <Reply className="mr-1 h-4 w-4" />
//                     <span>Reply</span>
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }



// "use client";

// import { useState, useEffect } from "react";
// import { getAuth } from "firebase/auth";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { ThumbsUp, Reply, Pencil, Trash } from "lucide-react";

// export function InterviewComments({ interviewId }: { interviewId: string }) {
//   const [comments, setComments] = useState<any[]>([]);
//   const [newComment, setNewComment] = useState("");
//   const [replyingTo, setReplyingTo] = useState<string | null>(null);
//   const [editingComment, setEditingComment] = useState<string | null>(null);
//   const [editContent, setEditContent] = useState("");
//   const auth = getAuth();
//   const user = auth.currentUser;

//   useEffect(() => {
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${interviewId}`)
//       .then((res) => res.json())
//       .then(setComments)
//       .catch(console.error);
//   }, [interviewId]);

//   const handleSubmitComment = async (e: React.FormEvent, parentCommentId: string | null = null) => {
//     e.preventDefault();
//     if (!user) return alert("You must be logged in to comment.");

//     const token = await user.getIdToken();
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//       body: JSON.stringify({ interviewId, content: newComment, parentCommentId }),
//     });

//     if (!response.ok) return alert("Failed to post comment.");
//     const comment = await response.json();
//     setComments([comment, ...comments]);
//     setNewComment("");
//     setReplyingTo(null);
//   };

//   const handleEditComment = async (commentId: string) => {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ content: editContent }),
//     });

//     if (!response.ok) return alert("Failed to edit comment.");
//     setComments(comments.map((c) => (c._id === commentId ? { ...c, content: editContent } : c)));
//     setEditingComment(null);
//   };

//   const handleDeleteComment = async (commentId: string) => {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`, {
//       method: "DELETE",
//     });

//     if (!response.ok) return alert("Failed to delete comment.");
//     setComments(comments.filter((c) => c._id !== commentId));
//   };

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>

//       <form onSubmit={handleSubmitComment}>
//         <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." />
//         <Button type="submit">Post Comment</Button>
//       </form>

//       {comments.map((comment) => (
//         <div key={comment._id} className="space-y-2">
//           <p>{comment.content}</p>
//           {user?.uid === comment.authorId && (
//             <>
//               <Button onClick={() => setEditingComment(comment._id)}><Pencil /></Button>
//               <Button onClick={() => handleDeleteComment(comment._id)}><Trash /></Button>
//             </>
//           )}
//           <Button onClick={() => setReplyingTo(comment._id)}><Reply /></Button>
//         </div>
//       ))}
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { getAuth } from "firebase/auth";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { ThumbsUp, Reply, Pencil, Trash, Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import { formatDistanceToNow } from "date-fns";
// import { cn } from "@/lib/utils";

// interface Comment {
//   _id: string;
//   authorId: string;
//   authorName: string;
//   authorPhotoURL?: string;
//   content: string;
//   createdAt: string;
//   parentCommentId?: string | null;
//   likes: number;
// }

// export function InterviewComments({ interviewId }: { interviewId: string }) {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [newComment, setNewComment] = useState("");
//   const [replyText, setReplyText] = useState("");
//   const [replyingTo, setReplyingTo] = useState<string | null>(null);
//   const [editingComment, setEditingComment] = useState<string | null>(null);
//   const [editContent, setEditContent] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const auth = getAuth();
//   const user = auth.currentUser;

//   useEffect(() => {
//     fetchComments();
//   }, [interviewId]);

//   const fetchComments = async () => {
//     setIsLoading(true);
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${interviewId}`);
//       if (!res.ok) {
//         throw new Error('Failed to fetch comments');
//       }
//       const data = await res.json();
//       setComments(data);
//     } catch (error) {
//       toast.error("Error loading comments");
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmitComment = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) {
//       toast.error("You must be logged in to comment");
//       return;
//     }
//     if (!newComment.trim()) return;

//     setIsSubmitting(true);
//     try {
//       const token = await user.getIdToken();
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           interviewId,
//           content: newComment,
//           parentCommentId: null
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to post comment');
//       }

//       const newCommentData = await response.json();
//       setComments([newCommentData, ...comments]);
//       setNewComment("");
//       toast.success("Comment posted successfully");
//     } catch (error) {
//       toast.error("Failed to post comment");
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleReply = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user || !replyingTo) {
//       toast.error("You must be logged in to reply");
//       return;
//     }
//     if (!replyText.trim()) return;

//     setIsSubmitting(true);
//     try {
//       const token = await user.getIdToken();
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           interviewId,
//           content: replyText,
//           parentCommentId: replyingTo
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to post reply');
//       }

//       const replyData = await response.json();
//       setComments([replyData, ...comments]);
//       setReplyText("");
//       setReplyingTo(null);
//       toast.success("Reply posted successfully");
//     } catch (error) {
//       toast.error("Failed to post reply");
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleEditComment = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user || !editingComment) {
//       toast.error("You must be the comment author to edit");
//       return;
//     }
//     if (!editContent.trim()) return;

//     setIsSubmitting(true);
//     try {
//       const token = await user.getIdToken();
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${editingComment}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ content: editContent }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to edit comment');
//       }

//       setComments(comments.map((c) => (c._id === editingComment ? { ...c, content: editContent } : c)));
//       setEditingComment(null);
//       toast.success("Comment updated successfully");
//     } catch (error) {
//       toast.error("Failed to update comment");
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDeleteComment = async (commentId: string) => {
//     if (!user) {
//       toast.error("You must be logged in to delete comments");
//       return;
//     }

//     if (!window.confirm("Are you sure you want to delete this comment?")) {
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const token = await user.getIdToken();
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete comment');
//       }

//       setComments(comments.filter((c) => c._id !== commentId));
//       toast.success("Comment deleted successfully");
//     } catch (error) {
//       toast.error("Failed to delete comment");
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleStartEdit = (comment: Comment) => {
//     setEditingComment(comment._id);
//     setEditContent(comment.content);
//   };

//   const handleLikeComment = async (commentId: string) => {
//     // Implementation for liking a comment would go here
//     // This is placeholder functionality
//     toast.info("Like functionality is coming soon!");
//   };

//   // Get the replies for a specific parent comment
//   const getReplies = (parentId: string) => {
//     return comments.filter(comment => comment.parentCommentId === parentId);
//   };

//   // Get only the top-level comments
//   const topLevelComments = comments.filter(comment => !comment.parentCommentId);

//   return (
//     <div className="space-y-6 py-4">
//       <h2 className="text-2xl font-bold mb-6">
//         Comments ({comments.length})
//       </h2>

//       <form onSubmit={handleSubmitComment} className="space-y-4 mb-8">
//         <Textarea
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           placeholder="Add a comment..."
//           className="min-h-[100px] p-3 border-2 focus:border-primary"
//           disabled={isSubmitting}
//         />
//         <div className="flex justify-end">
//           <Button
//             type="submit"
//             disabled={isSubmitting || !newComment.trim()}
//             className="px-6"
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Posting...
//               </>
//             ) : (
//               "Post Comment"
//             )}
//           </Button>
//         </div>
//       </form>

//       {isLoading ? (
//         <div className="flex justify-center py-8">
//           <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
//         </div>
//       ) : topLevelComments.length === 0 ? (
//         <div className="text-center py-8 text-muted-foreground">
//           Be the first to comment on this interview experience!
//         </div>
//       ) : (
//         <div className="space-y-8">
//           {topLevelComments.map((comment) => (
//             <div key={comment._id} className="comment-container">
//               <div className="space-y-2 border rounded-lg p-4 shadow-sm">
//                 <div className="flex items-start space-x-4">
//                   <Avatar className="h-10 w-10 border-2 border-background">
//                     {comment.authorPhotoURL ? (
//                       <AvatarImage src={comment.authorPhotoURL} alt={comment.authorName} />
//                     ) : (
//                       <AvatarFallback className="bg-primary/10 text-primary">
//                         {comment.authorName?.charAt(0) || "U"}
//                       </AvatarFallback>
//                     )}
//                   </Avatar>
//                   <div className="flex-1 space-y-1">
//                     <div className="flex items-center flex-wrap gap-2">
//                       <span className="font-medium">{comment.authorName}</span>
//                       <span className="text-xs text-muted-foreground">
//                         {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
//                       </span>
//                     </div>

//                     {editingComment === comment._id ? (
//                       <form onSubmit={handleEditComment} className="mt-2 space-y-2">
//                         <Textarea
//                           value={editContent}
//                           onChange={(e) => setEditContent(e.target.value)}
//                           className="min-h-[80px]"
//                         />
//                         <div className="flex gap-2 justify-end">
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={() => setEditingComment(null)}
//                             disabled={isSubmitting}
//                           >
//                             Cancel
//                           </Button>
//                           <Button
//                             type="submit"
//                             size="sm"
//                             disabled={isSubmitting || !editContent.trim()}
//                           >
//                             {isSubmitting ? (
//                               <Loader2 className="h-4 w-4 animate-spin" />
//                             ) : (
//                               "Save"
//                             )}
//                           </Button>
//                         </div>
//                       </form>
//                     ) : (
//                       <p className="text-sm leading-relaxed whitespace-pre-wrap">
//                         {comment.content}
//                       </p>
//                     )}

//                     <div className="flex items-center space-x-2 pt-2">
//                       <Button variant="ghost" size="sm" className="h-8 text-xs"
//                         onClick={() => handleLikeComment(comment._id)}>
//                         <ThumbsUp className="mr-1 h-3.5 w-3.5" />
//                         {comment.likes || 0}
//                       </Button>
//                       <Button variant="ghost" size="sm" className="h-8 text-xs"
//                         onClick={() => setReplyingTo(comment._id === replyingTo ? null : comment._id)}>
//                         <Reply className="mr-1 h-3.5 w-3.5" />
//                         Reply
//                       </Button>

//                       {user?.uid === comment.authorId && (
//                         <>
//                           <Button variant="ghost" size="sm" className="h-8 text-xs"
//                             onClick={() => handleStartEdit(comment)}>
//                             <Pencil className="mr-1 h-3.5 w-3.5" />
//                             Edit
//                           </Button>
//                           <Button variant="ghost" size="sm" className="h-8 text-xs text-destructive hover:text-destructive/80"
//                             onClick={() => handleDeleteComment(comment._id)}>
//                             <Trash className="mr-1 h-3.5 w-3.5" />
//                             Delete
//                           </Button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {replyingTo === comment._id && (
//                 <div className="ml-12 mt-3 border-l-2 pl-4 border-muted">
//                   <form onSubmit={handleReply} className="space-y-3">
//                     <Textarea
//                       value={replyText}
//                       onChange={(e) => setReplyText(e.target.value)}
//                       placeholder={`Replying to ${comment.authorName}...`}
//                       className="min-h-[80px]"
//                     />
//                     <div className="flex gap-2 justify-end">
//                       <Button
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setReplyingTo(null)}
//                       >
//                         Cancel
//                       </Button>
//                       <Button
//                         type="submit"
//                         size="sm"
//                         disabled={isSubmitting || !replyText.trim()}
//                       >
//                         {isSubmitting ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           "Post Reply"
//                         )}
//                       </Button>
//                     </div>
//                   </form>
//                 </div>
//               )}

//               {/* Render replies */}
//               {getReplies(comment._id).length > 0 && (
//                 <div className="ml-12 mt-4 space-y-4 border-l-2 border-muted">
//                   {getReplies(comment._id).map(reply => (
//                     <div key={reply._id} className="pl-4">
//                       <div className="border rounded-lg p-3 shadow-sm">
//                         <div className="flex items-start space-x-3">
//                           <Avatar className="h-8 w-8">
//                             {reply.authorPhotoURL ? (
//                               <AvatarImage src={reply.authorPhotoURL} alt={reply.authorName} />
//                             ) : (
//                               <AvatarFallback className="bg-primary/10 text-primary text-xs">
//                                 {reply.authorName?.charAt(0) || "U"}
//                               </AvatarFallback>
//                             )}
//                           </Avatar>
//                           <div className="flex-1 space-y-1">
//                             <div className="flex items-center flex-wrap gap-2">
//                               <span className="font-medium text-sm">{reply.authorName}</span>
//                               <span className="text-xs text-muted-foreground">
//                                 {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
//                               </span>
//                             </div>

//                             {editingComment === reply._id ? (
//                               <form onSubmit={handleEditComment} className="mt-2 space-y-2">
//                                 <Textarea
//                                   value={editContent}
//                                   onChange={(e) => setEditContent(e.target.value)}
//                                   className="min-h-[80px]"
//                                 />
//                                 <div className="flex gap-2 justify-end">
//                                   <Button
//                                     type="button"
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => setEditingComment(null)}
//                                   >
//                                     Cancel
//                                   </Button>
//                                   <Button
//                                     type="submit"
//                                     size="sm"
//                                     disabled={isSubmitting || !editContent.trim()}
//                                   >
//                                     Save
//                                   </Button>
//                                 </div>
//                               </form>
//                             ) : (
//                               <p className="text-sm leading-relaxed whitespace-pre-wrap">
//                                 {reply.content}
//                               </p>
//                             )}

//                             <div className="flex items-center space-x-2 pt-1">
//                               <Button variant="ghost" size="sm" className="h-7 text-xs"
//                                 onClick={() => handleLikeComment(reply._id)}>
//                                 <ThumbsUp className="mr-1 h-3 w-3" />
//                                 {reply.likes || 0}
//                               </Button>

//                               {user?.uid === reply.authorId && (
//                                 <>
//                                   <Button variant="ghost" size="sm" className="h-7 text-xs"
//                                     onClick={() => handleStartEdit(reply)}>
//                                     <Pencil className="mr-1 h-3 w-3" />
//                                     Edit
//                                   </Button>
//                                   <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive/80"
//                                     onClick={() => handleDeleteComment(reply._id)}>
//                                     <Trash className="mr-1 h-3 w-3" />
//                                     Delete
//                                   </Button>
//                                 </>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import { getAuth } from "firebase/auth";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { ThumbsUp, Reply, Pencil, Trash } from "lucide-react";
// import { toast } from "@/components/ui/use-toast";

// // Types
// interface Author {
//   id: string;
//   name: string;
//   avatar: string;
//   initials: string;
// }

// interface Comment {
//   _id: string;
//   authorId: string;
//   author: Author;
//   content: string;
//   createdAt: string;
//   likes: number;
//   isAuthor?: boolean;
//   parentCommentId?: string | null;
// }

// export function InterviewComments({ interviewId }: { interviewId: string }) {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [newComment, setNewComment] = useState("");
//   const [replyingTo, setReplyingTo] = useState<string | null>(null);
//   const [editingComment, setEditingComment] = useState<string | null>(null);
//   const [editContent, setEditContent] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const auth = getAuth();
//   const user = auth.currentUser;

//   // Fetch comments on component mount
//   useEffect(() => {
//     const fetchComments = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
//         const response = await fetch(`${apiUrl}/api/comments/${interviewId}`);

//         if (!response.ok) {
//           throw new Error(`Failed to fetch comments: ${response.status}`);
//         }

//         const data = await response.json();
//         setComments(data);
//       } catch (err) {
//         console.error("Error fetching comments:", err);
//         setError("Failed to load comments. Please try again later.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchComments();
//   }, [interviewId]);

//   const handleEditComment = async (commentId: string) => {
//     if (!user) return;
//     if (!editContent.trim()) return;

//     setIsLoading(true);
//     try {
//       const token = await user.getIdToken();
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
//       const response = await fetch(`${apiUrl}/api/comments/${commentId}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ content: editContent }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to edit comment: ${response.status}`);
//       }

//       // Update the comment in the state
//       setComments(prev =>
//         prev.map(c => c._id === commentId ? { ...c, content: editContent } : c)
//       );
//       setEditingComment(null);
//       setEditContent("");

//       toast({
//         title: "Comment updated",
//         description: "Your comment has been updated successfully.",
//       });
//     } catch (err) {
//       console.error("Error editing comment:", err);
//       toast({
//         title: "Error",
//         description: "Failed to edit comment. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteComment = async (commentId: string) => {
//     if (!user) return;
//     if (!confirm("Are you sure you want to delete this comment?")) return;

//     setIsLoading(true);
//     try {
//       const token = await user.getIdToken();
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
//       const response = await fetch(`${apiUrl}/api/comments/${commentId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to delete comment: ${response.status}`);
//       }

//       // Remove the comment from the state
//       setComments(prev => prev.filter(c => c._id !== commentId));

//       toast({
//         title: "Comment deleted",
//         description: "Your comment has been deleted successfully.",
//       });
//     } catch (err) {
//       console.error("Error deleting comment:", err);
//       toast({
//         title: "Error",
//         description: "Failed to delete comment. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLikeComment = async (commentId: string) => {
//     if (!user) {
//       toast({
//         title: "Authentication required",
//         description: "You must be logged in to like comments.",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       const token = await user.getIdToken();
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
//       const response = await fetch(`${apiUrl}/api/comments/${commentId}/like`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to like comment: ${response.status}`);
//       }

//       // Update like count in the state
//       setComments(prev =>
//         prev.map(c => c._id === commentId ? { ...c, likes: c.likes + 1 } : c)
//       );
//     } catch (err) {
//       console.error("Error liking comment:", err);
//       toast({
//         title: "Error",
//         description: "Failed to like comment. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   // Submit a new comment or reply
//   const handleSubmitComment = async (e: React.FormEvent, parentCommentId: string | null = null) => {
//     e.preventDefault();
//     if (!user) {
//       toast({ title: "Authentication required", description: "You must be logged in to comment.", variant: "destructive" });
//       return;
//     }

//     if (!newComment.trim()) return;

//     setIsLoading(true);
//     try {
//       const token = await user.getIdToken();
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
//       const response = await fetch(`${apiUrl}/api/comments`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         body: JSON.stringify({ interviewId, content: newComment, parentCommentId }),
//       });

//       if (!response.ok) throw new Error(`Failed to post comment: ${response.status}`);

//       const comment = await response.json();
//       setComments(prev => [comment, ...prev]); // Add to the top
//       setNewComment("");
//       setReplyingTo(null);

//       toast({ title: "Comment posted", description: "Your comment has been posted successfully." });
//     } catch (err) {
//       console.error("Error posting comment:", err);
//       toast({ title: "Error", description: "Failed to post comment. Please try again.", variant: "destructive" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Get replies for a specific comment
//   const getReplies = (commentId: string) => comments.filter(comment => comment.parentCommentId === commentId);

//   // Render a comment and its replies recursively
//   const renderComment = (comment: Comment) => (
//     <div key={comment._id} className="space-y-4">
//       <div className="flex items-start space-x-4">
//         <Avatar className="h-10 w-10">
//           <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
//           <AvatarFallback>{comment.author.initials}</AvatarFallback>
//         </Avatar>
//         <div className="flex-1 space-y-2">
//           <div className="flex items-center">
//             <span className="font-medium">{comment.author.name}</span>
//             <span className="ml-2 text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
//           </div>

//           {editingComment === comment._id ? (
//             <form onSubmit={(e) => { e.preventDefault(); handleEditComment(comment._id); }} className="space-y-2">
//               <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="min-h-[100px]" />
//               <div className="flex space-x-2">
//                 <Button type="submit" disabled={!editContent.trim()}>Save</Button>
//                 <Button type="button" variant="outline" onClick={() => { setEditingComment(null); setEditContent(""); }}>Cancel</Button>
//               </div>
//             </form>
//           ) : (
//             <p>{comment.content}</p>
//           )}

//           <div className="flex items-center space-x-4 pt-1">
//             <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => handleLikeComment(comment._id)} disabled={!user}>
//               <ThumbsUp className="mr-1 h-4 w-4" />
//               <span>{comment.likes || 0}</span>
//             </Button>
//             <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)} disabled={!user}>
//               <Reply className="mr-1 h-4 w-4" />
//               <span>Reply</span>
//             </Button>
//             {user && user.uid === comment.authorId && (
//               <>
//                 <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => { setEditingComment(comment._id); setEditContent(comment.content); }}>
//                   <Pencil className="mr-1 h-4 w-4" />
//                   <span>Edit</span>
//                 </Button>
//                 <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive hover:text-destructive" onClick={() => handleDeleteComment(comment._id)}>
//                   <Trash className="mr-1 h-4 w-4" />
//                   <span>Delete</span>
//                 </Button>
//               </>
//             )}
//           </div>

//           {replyingTo === comment._id && (
//             <form onSubmit={(e) => handleSubmitComment(e, comment._id)} className="mt-4 space-y-2">
//               <Textarea placeholder="Write a reply..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="min-h-[80px]" />
//               <div className="flex space-x-2">
//                 <Button type="submit" disabled={!newComment.trim()}>Reply</Button>
//                 <Button type="button" variant="outline" onClick={() => setReplyingTo(null)}>Cancel</Button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>

//       {getReplies(comment._id).length > 0 && (
//         <div className="ml-12 border-l-2 pl-4 border-muted space-y-4">
//           {getReplies(comment._id).map(reply => renderComment(reply))}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
//       <div className="space-y-8">{comments.length > 0 ? comments.filter(c => !c.parentCommentId).map(renderComment) : <p>No comments yet. Be the first to comment.</p>}</div>
//     </div>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, Reply, Pencil, Trash, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Types
interface Author {
  id: string;
  name: string;
  avatar: string;
  initials: string;
}

interface Comment {
  _id: string;
  authorId: string;
  author: Author;
  content: string;
  createdAt: string;
  likes: number;
  isAuthor?: boolean;
  parentCommentId?: string | null;
}

export function InterviewComments({ interviewId }: { interviewId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch comments on component mount
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const response = await fetch(`${apiUrl}/api/comments/${interviewId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch comments: ${response.status}`);
        }

        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [interviewId]);

  // Submit a new comment or reply
  const handleSubmitComment = async (e: React.FormEvent, parentCommentId: string | null = null) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to comment.",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const token = await user.getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${apiUrl}/api/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          interviewId,
          content: newComment,
          parentCommentId
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to post comment: ${response.status}`);
      }

      const comment = await response.json();

      // Add the new comment to the beginning of the list
      setComments(prev => [comment, ...prev]);
      setNewComment("");
      setReplyingTo(null);

      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully.",
      });
    } catch (err) {
      console.error("Error posting comment:", err);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Edit an existing comment
  const handleEditComment = async (commentId: string) => {
    if (!user) return;
    if (!editContent.trim()) return;

    setIsLoading(true);
    try {
      const token = await user.getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${apiUrl}/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: editContent }),
      });

      if (!response.ok) {
        throw new Error(`Failed to edit comment: ${response.status}`);
      }

      // Update the comment in the state
      setComments(prev =>
        prev.map(c => c._id === commentId ? { ...c, content: editContent } : c)
      );
      setEditingComment(null);
      setEditContent("");

      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully.",
      });
    } catch (err) {
      console.error("Error editing comment:", err);
      toast({
        title: "Error",
        description: "Failed to edit comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setIsLoading(true);
    try {
      const token = await user.getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${apiUrl}/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete comment: ${response.status}`);
      }

      // Remove the comment from the state
      setComments(prev => prev.filter(c => c._id !== commentId));

      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully.",
      });
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle like functionality
  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to like comments.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = await user.getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${apiUrl}/api/comments/${commentId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to like comment: ${response.status}`);
      }

      // Update like count in the state
      setComments(prev =>
        prev.map(c => c._id === commentId ? { ...c, likes: c.likes + 1 } : c)
      );
    } catch (err) {
      console.error("Error liking comment:", err);
      toast({
        title: "Error",
        description: "Failed to like comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get replies for a specific comment
  const getReplies = (commentId: string) => {
    return comments.filter(comment => comment.parentCommentId === commentId);
  };

  // Get top-level comments
  const topLevelComments = comments.filter(comment => !comment.parentCommentId);

  // Render a comment and its replies recursively
  const renderComment = (comment: Comment) => (
    <div key={comment._id} className="space-y-4">
      <div className="flex items-start space-x-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.author.avatar || "/placeholder.svg?height=40&width=40"} alt={comment.author.name} />
          <AvatarFallback>{comment.author.initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center">
            <span className="font-medium">{comment.author.name}</span>
            {comment.isAuthor && (
              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Author</span>
            )}
            <span className="ml-2 text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
          </div>

          {editingComment === comment._id ? (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditComment(comment._id);
            }} className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex space-x-2">
                <Button type="submit" disabled={isLoading || !editContent.trim()}>
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingComment(null);
                    setEditContent("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <p>{comment.content}</p>
          )}

          <div className="flex items-center space-x-4 pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => handleLikeComment(comment._id)}
              disabled={isLoading || !user}
            >
              <ThumbsUp className="mr-1 h-4 w-4" />
              <span>{comment.likes || 0}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => {
                setReplyingTo(replyingTo === comment._id ? null : comment._id);
                setEditingComment(null);
              }}
              disabled={isLoading || !user}
            >
              <Reply className="mr-1 h-4 w-4" />
              <span>Reply</span>
            </Button>

            {user && user.uid === comment.authorId && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => {
                    setEditingComment(editingComment === comment._id ? null : comment._id);
                    setEditContent(comment.content);
                    setReplyingTo(null);
                  }}
                  disabled={isLoading}
                >
                  <Pencil className="mr-1 h-4 w-4" />
                  <span>Edit</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-destructive hover:text-destructive"
                  onClick={() => handleDeleteComment(comment._id)}
                  disabled={isLoading}
                >
                  <Trash className="mr-1 h-4 w-4" />
                  <span>Delete</span>
                </Button>
              </>
            )}
          </div>

          {replyingTo === comment._id && (
            <form
              onSubmit={(e) => handleSubmitComment(e, comment._id)}
              className="mt-4 space-y-2"
            >
              <Textarea
                placeholder="Write a reply..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={isLoading || !newComment.trim()}
                >
                  Reply
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Render replies */}
      {getReplies(comment._id).length > 0 && (
        <div className="ml-12 border-l-2 pl-4 border-muted space-y-4">
          {getReplies(comment._id).map(reply => renderComment(reply))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      {user ? (
        <form onSubmit={(e) => handleSubmitComment(e)} className="space-y-4">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !newComment.trim()}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Posting...</span>
              </div>
            ) : (
              "Post Comment"
            )}
          </Button>
        </form>
      ) : (
        <div className="p-4 bg-muted rounded-md">
          <p>Please log in to add a comment.</p>
        </div>
      )}

      <div className="space-y-8">
        {isLoading && comments.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : topLevelComments.length > 0 ? (
          topLevelComments.map(comment => renderComment(comment))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
}
