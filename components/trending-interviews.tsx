import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, MessageSquare, Calendar } from "lucide-react"

// Mock data for trending interviews
const trendingInterviews = [
  {
    id: 1,
    company: "Google",
    role: "Software Engineer",
    level: "Experienced",
    date: "2 days ago",
    likes: 124,
    comments: 32,
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
    },
    tags: ["DSA", "System Design", "Behavioral"],
  },
  {
    id: 2,
    company: "Amazon",
    role: "Data Scientist",
    level: "Fresher",
    date: "1 week ago",
    likes: 98,
    comments: 24,
    author: {
      name: "Sarah Miller",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SM",
    },
    tags: ["ML", "SQL", "Probability"],
  },
  {
    id: 3,
    company: "Microsoft",
    role: "Product Manager",
    level: "Internship",
    date: "2 weeks ago",
    likes: 76,
    comments: 18,
    author: {
      name: "Anonymous",
      avatar: "",
      initials: "A",
    },
    tags: ["Product Design", "Behavioral", "Case Study"],
  },
]

export function TrendingInterviews() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
      {trendingInterviews.map((interview) => (
        <Card key={interview.id} className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{interview.company}</CardTitle>
                <div className="text-sm text-muted-foreground mt-1">
                  {interview.role} • {interview.level}
                </div>
              </div>
              <Badge variant="outline" className="ml-2">
                {interview.level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="flex flex-wrap gap-2 mt-2">
              {interview.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={interview.author.avatar} alt={interview.author.name} />
                <AvatarFallback>{interview.author.initials}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{interview.author.name}</p>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>{interview.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="flex items-center">
                <ThumbsUp className="mr-1 h-4 w-4" />
                <span className="text-xs">{interview.likes}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="mr-1 h-4 w-4" />
                <span className="text-xs">{interview.comments}</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
