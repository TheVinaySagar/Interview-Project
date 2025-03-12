// "use client"

// import Link from "next/link"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { ThumbsUp, MessageSquare, Calendar } from "lucide-react"
// import { useEffect,  useState } from "react"
// import axios from "axios"

// Mock data for interviews
// const interviews = [
//   {
//     id: 1,
//     company: "Google",
//     role: "Software Engineer",
//     level: "Experienced",
//     date: "2 days ago",
//     likes: 124,
//     comments: 32,
//     author: {
//       name: "Alex Johnson",
//       avatar: "/placeholder.svg?height=40&width=40",
//       initials: "AJ",
//     },
//     tags: ["DSA", "System Design", "Behavioral"],
//   },
//   {
//     id: 2,
//     company: "Amazon",
//     role: "Data Scientist",
//     level: "Fresher",
//     date: "1 week ago",
//     likes: 98,
//     comments: 24,
//     author: {
//       name: "Sarah Miller",
//       avatar: "/placeholder.svg?height=40&width=40",
//       initials: "SM",
//     },
//     tags: ["ML", "SQL", "Probability"],
//   },
//   {
//     id: 3,
//     company: "Microsoft",
//     role: "Product Manager",
//     level: "Internship",
//     date: "2 weeks ago",
//     likes: 76,
//     comments: 18,
//     author: {
//       name: "Anonymous",
//       avatar: "",
//       initials: "A",
//     },
//     tags: ["Product Design", "Behavioral", "Case Study"],
//   },
//   {
//     id: 4,
//     company: "Apple",
//     role: "iOS Developer",
//     level: "Experienced",
//     date: "3 weeks ago",
//     likes: 65,
//     comments: 12,
//     author: {
//       name: "Mike Chen",
//       avatar: "/placeholder.svg?height=40&width=40",
//       initials: "MC",
//     },
//     tags: ["Swift", "System Design", "Coding"],
//   },
//   {
//     id: 5,
//     company: "Meta",
//     role: "Frontend Engineer",
//     level: "Fresher",
//     date: "1 month ago",
//     likes: 54,
//     comments: 8,
//     author: {
//       name: "Jessica Lee",
//       avatar: "/placeholder.svg?height=40&width=40",
//       initials: "JL",
//     },
//     tags: ["React", "JavaScript", "CSS"],
//   },
//   {
//     id: 6,
//     company: "Netflix",
//     role: "Backend Engineer",
//     level: "Experienced",
//     date: "1 month ago",
//     likes: 42,
//     comments: 6,
//     author: {
//       name: "Anonymous",
//       avatar: "",
//       initials: "A",
//     },
//     tags: ["Java", "Microservices", "System Design"],
//   },
// ]

// export function Interviews() {

//     const [interviews, setInterviews] = useState([]);

//     useEffect(() => {
//         axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/interviews/user-interviews`, {
//         })

//         .then(response => setInterviews(response.data))
//         .catch(() => setError('Failed to fetch interviews. Please try again.'))
//         .finally(() => setLoading(false));
//     }, []);
//     console.log(interviews)
//   return (
//     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
//       {interviews.map((interview) => (
//         <Link href={`/interviews/${interview.id}`} key={interview.id}>
//           <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
//             <CardHeader className="p-4 pb-2">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <CardTitle className="text-xl">{interview.company}</CardTitle>
//                   <div className="text-sm text-muted-foreground mt-1">
//                     {interview.role} • {interview.level}
//                   </div>
//                 </div>
//                 <Badge variant="outline" className="ml-2">
//                   {interview.level}
//                 </Badge>
//               </div>
//             </CardHeader>
//             <CardContent className="p-4 pt-2">
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {interview.tags.map((tag) => (
//                   <Badge key={tag} variant="secondary" className="text-xs">
//                     {tag}
//                   </Badge>
//                 ))}
//               </div>
//             </CardContent>
//             <CardFooter className="p-4 pt-0 flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <Avatar className="h-8 w-8">
//                   <AvatarImage src={interview.author.avatar} alt={interview.author.name} />
//                   <AvatarFallback>{interview.author.initials}</AvatarFallback>
//                 </Avatar>
//                 <div className="text-sm">
//                   <p className="font-medium">{interview.author.name}</p>
//                   <div className="flex items-center text-muted-foreground">
//                     <Calendar className="mr-1 h-3 w-3" />
//                     <span>{interview.date}</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2 text-muted-foreground">
//                 <div className="flex items-center">
//                   <ThumbsUp className="mr-1 h-4 w-4" />
//                   <span className="text-xs">{interview.likes}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <MessageSquare className="mr-1 h-4 w-4" />
//                   <span className="text-xs">{interview.comments}</span>
//                 </div>
//               </div>
//             </CardFooter>
//           </Card>
//         </Link>
//       ))}
//     </div>
//   )
// }


"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, ThumbsUp } from "lucide-react";

export function Interviews() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state
    const [error, setError] = useState("");       // Added error state

    useEffect(() => {
        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/api/interviews`)
            .then(response => {
                // console.log('API Response:', response.data);  // 👀 Check this
                setInterviews(response.data);
            })
            .catch(() => setError("Failed to fetch interviews. Please try again."))
            .finally(() => setLoading(false));
    }, []);


    if (loading) return <p className="text-center py-4">Loading interviews...</p>;
    if (error) return <p className="text-center text-red-500 py-4">{error}</p>;

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {interviews.map((interview: any) => (
                <Link href={`/interviews/${interview._id}`} key={interview._id}>
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
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
                        <CardContent className="p-4 pt-2 min-h-0">
                            <div className="flex flex-wrap gap-2 mt-2">
                                {interview.tags?.map((tag: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={interview.author?.avatar} alt={interview.author?.name} />
                                    <AvatarFallback>{interview.author?.initials || "NA"}</AvatarFallback>
                                </Avatar>
                                <div className="text-sm">
                                    <p className="font-medium">{interview.authorName || "Unknown Author"}</p>
                                    <div className="flex items-center text-muted-foreground">
                                        <Calendar className="mr-1 h-3 w-3" />
                                        <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                                <div className="flex items-center">
                                    <ThumbsUp className="mr-1 h-4 w-4" />
                                    <span className="text-xs">{interview.likes || 0}</span>
                                </div>
                                <div className="flex items-center">
                                    <MessageSquare className="mr-1 h-4 w-4" />
                                    <span className="text-xs">{interview.comments || 0}</span>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
