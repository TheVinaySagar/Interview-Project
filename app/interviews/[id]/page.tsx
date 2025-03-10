import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ThumbsUp, MessageSquare, Share2, Calendar, Building, Briefcase, Award } from "lucide-react"
import { InterviewComments } from "@/components/interview-comments"

// Mock data for a detailed interview
const interview = {
  id: 1,
  company: "Google",
  role: "Software Engineer",
  level: "Experienced",
  date: "March 15, 2023",
  likes: 124,
  comments: 32,
  author: {
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AJ",
  },
  tags: ["DSA", "System Design", "Behavioral"],
  content: `
    <p>I recently interviewed for a Software Engineer position at Google. The interview process consisted of 5 rounds:</p>
    
    <h3>Round 1: Phone Screen</h3>
    <p>The first round was a 45-minute phone screen with a recruiter. They asked about my background, experience, and why I wanted to work at Google.</p>
    
    <h3>Round 2: Technical Phone Interview</h3>
    <p>This was a 1-hour technical interview where I had to solve a coding problem on a shared document. The problem was about finding the longest substring without repeating characters.</p>
    
    <h3>Round 3-6: Onsite Interviews</h3>
    <p>The onsite consisted of 4 interviews:</p>
    <ul>
      <li>2 coding interviews focusing on data structures and algorithms</li>
      <li>1 system design interview where I had to design a URL shortener</li>
      <li>1 behavioral interview discussing my past experiences and how I handled certain situations</li>
    </ul>
    
    <h3>Key Questions:</h3>
    <ol>
      <li>Implement a function to find the kth largest element in an unsorted array.</li>
      <li>Design a system that can handle millions of URL shortening requests per day.</li>
      <li>Describe a situation where you had a conflict with a team member and how you resolved it.</li>
      <li>Implement an LRU cache with O(1) time complexity for both get and put operations.</li>
    </ol>
    
    <h3>Tips for Future Candidates:</h3>
    <p>Make sure to practice coding problems on LeetCode, especially medium to hard difficulty. For system design, understand scalability concepts and be prepared to discuss trade-offs. For behavioral questions, use the STAR method to structure your answers.</p>
  `,
  questions: [
    {
      question: "Implement a function to find the kth largest element in an unsorted array.",
      answer:
        "I used a min-heap approach to solve this problem. By maintaining a min-heap of size k, I could ensure that the smallest element in the heap is the kth largest element in the array.",
    },
    {
      question: "Design a system that can handle millions of URL shortening requests per day.",
      answer:
        "I proposed a distributed system with a load balancer, multiple application servers, and a database cluster. For the URL shortening algorithm, I suggested using a base62 encoding of an auto-incrementing ID.",
    },
    {
      question: "Describe a situation where you had a conflict with a team member and how you resolved it.",
      answer:
        "I described a situation where a team member and I disagreed on the approach to a project. I listened to their perspective, explained mine, and we found a compromise that incorporated the best aspects of both approaches.",
    },
    {
      question: "Implement an LRU cache with O(1) time complexity for both get and put operations.",
      answer:
        "I implemented this using a combination of a doubly linked list and a hash map. The linked list maintains the order of access, while the hash map provides O(1) access to the nodes.",
    },
  ],
}

export default function InterviewDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ThumbsUp className="h-5 w-5" />
              </Button>
              <span className="font-medium">{interview.likes}</span>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <span className="font-medium">{interview.comments}</span>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            <Button variant="outline" asChild>
              <Link href="/interviews">Back to Interviews</Link>
            </Button>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{interview.company} Interview Experience</h1>
            <div className="flex flex-wrap gap-2">
              {interview.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={interview.author.avatar} alt={interview.author.name} />
              <AvatarFallback>{interview.author.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{interview.author.name}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                <span>{interview.date}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: interview.content }} />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Interview Questions</h2>
            {interview.questions.map((q, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <h3 className="font-bold">Q: {q.question}</h3>
                  <p className="mt-2">A: {q.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator />

          <InterviewComments />
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-bold text-lg">Interview Details</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Company: {interview.company}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Role: {interview.role}</span>
                </div>
                <div className="flex items-center">
                  <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Level: {interview.level}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Date: {interview.date}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-bold text-lg">Similar Interviews</h3>
              <div className="space-y-2">
                <Link href="#" className="block hover:underline">
                  Google - Product Manager
                </Link>
                <Link href="#" className="block hover:underline">
                  Google - Data Scientist
                </Link>
                <Link href="#" className="block hover:underline">
                  Microsoft - Software Engineer
                </Link>
                <Link href="#" className="block hover:underline">
                  Amazon - Software Engineer
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

