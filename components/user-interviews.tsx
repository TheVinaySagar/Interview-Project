"use client"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, Edit, MoreHorizontal, Trash } from "lucide-react"

// Mock data for user interviews
const userInterviews = [
  {
    id: 1,
    company: "Google",
    role: "Software Engineer",
    level: "Experienced",
    date: "Mar 15, 2023",
    status: "published",
    views: 1240,
    likes: 124,
    comments: 32,
  },
  {
    id: 2,
    company: "Amazon",
    role: "Data Scientist",
    level: "Fresher",
    date: "Feb 10, 2023",
    status: "published",
    views: 980,
    likes: 98,
    comments: 24,
  },
  {
    id: 3,
    company: "Microsoft",
    role: "Product Manager",
    level: "Internship",
    date: "Jan 25, 2023",
    status: "draft",
    views: 0,
    likes: 0,
    comments: 0,
  },
]

export function UserInterviews() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Interviews</h2>
        <Button asChild>
          <Link href="/submit">Share New Experience</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {userInterviews.map((interview) => (
          <Card key={interview.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl">{interview.company}</CardTitle>
                <div className="text-sm text-muted-foreground mt-1">
                  {interview.role} • {interview.level}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {interview.status === "draft" && <Badge variant="outline">Draft</Badge>}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                <span>Posted on {interview.date}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                {interview.status === "published" ? (
                  <>
                    {interview.views} views • {interview.likes} likes • {interview.comments} comments
                  </>
                ) : (
                  "Not published yet"
                )}
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/interviews/${interview.id}`}>
                  {interview.status === "published" ? "View" : "Continue Editing"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

