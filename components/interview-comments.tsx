"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, Reply } from "lucide-react"

// Mock data for comments
const comments = [
  {
    id: 1,
    author: {
      name: "Sarah Miller",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SM",
    },
    content:
      "Thanks for sharing your experience! The system design question about URL shortener is particularly helpful as I'm preparing for a similar interview.",
    date: "2 days ago",
    likes: 8,
  },
  {
    id: 2,
    author: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JD",
    },
    content: "Did they ask any questions about distributed systems or microservices architecture?",
    date: "1 day ago",
    likes: 3,
  },
  {
    id: 3,
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
    },
    content:
      "Yes, they did ask about microservices during the system design round. They wanted to know how I would handle inter-service communication and data consistency.",
    date: "1 day ago",
    likes: 5,
    isAuthor: true,
    replyTo: 2,
  },
]

export function InterviewComments() {
  const [newComment, setNewComment] = React.useState("")

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit the comment to the backend
    setNewComment("")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>

      <form onSubmit={handleSubmitComment} className="space-y-4">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button type="submit" disabled={!newComment.trim()}>
          Post Comment
        </Button>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className={`space-y-2 ${comment.replyTo ? "ml-12 border-l-2 pl-4 border-muted" : ""}`}>
            <div className="flex items-start space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                <AvatarFallback>{comment.author.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center">
                  <span className="font-medium">{comment.author.name}</span>
                  {comment.isAuthor && (
                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Author</span>
                  )}
                  <span className="ml-2 text-xs text-muted-foreground">{comment.date}</span>
                </div>
                <p>{comment.content}</p>
                <div className="flex items-center space-x-4 pt-1">
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    <span>{comment.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Reply className="mr-1 h-4 w-4" />
                    <span>Reply</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

