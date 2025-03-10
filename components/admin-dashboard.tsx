"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Flag, Trash, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for admin dashboard
const flaggedInterviews = [
  {
    id: 1,
    company: "Google",
    role: "Software Engineer",
    author: "Alex Johnson",
    date: "Mar 15, 2023",
    reason: "Inappropriate content",
    reportedBy: "user123",
  },
  {
    id: 2,
    company: "Amazon",
    role: "Data Scientist",
    author: "Sarah Miller",
    date: "Feb 10, 2023",
    reason: "Misleading information",
    reportedBy: "user456",
  },
  {
    id: 3,
    company: "Microsoft",
    role: "Product Manager",
    author: "Anonymous",
    date: "Jan 25, 2023",
    reason: "Spam",
    reportedBy: "user789",
  },
]

const pendingInterviews = [
  {
    id: 4,
    company: "Apple",
    role: "iOS Developer",
    author: "Mike Chen",
    date: "Apr 5, 2023",
    status: "pending",
  },
  {
    id: 5,
    company: "Meta",
    role: "Frontend Engineer",
    author: "Jessica Lee",
    date: "Apr 3, 2023",
    status: "pending",
  },
  {
    id: 6,
    company: "Netflix",
    role: "Backend Engineer",
    author: "Anonymous",
    date: "Apr 1, 2023",
    status: "pending",
  },
]

const stats = [
  { title: "Total Interviews", value: "1,234" },
  { title: "Active Users", value: "5,678" },
  { title: "Pending Reviews", value: "12" },
  { title: "Flagged Content", value: "3" },
]

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="flagged">
        <TabsList className="mb-6">
          <TabsTrigger value="flagged">Flagged Content</TabsTrigger>
          <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="flagged">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Interviews</CardTitle>
              <CardDescription>Review and moderate interviews that have been flagged by users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flaggedInterviews.map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell className="font-medium">{interview.company}</TableCell>
                      <TableCell>{interview.role}</TableCell>
                      <TableCell>{interview.author}</TableCell>
                      <TableCell>{interview.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{interview.reason}</Badge>
                      </TableCell>
                      <TableCell>{interview.reportedBy}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reviews</CardTitle>
              <CardDescription>Review and approve new interview submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingInterviews.map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell className="font-medium">{interview.company}</TableCell>
                      <TableCell>{interview.role}</TableCell>
                      <TableCell>{interview.author}</TableCell>
                      <TableCell>{interview.date}</TableCell>
                      <TableCell>
                        <Badge>{interview.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <X className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Reject</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Flag className="h-4 w-4" />
                            <span className="sr-only">Flag</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

