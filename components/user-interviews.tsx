// "use client"
// import Link from "next/link"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Calendar, Edit, MoreHorizontal, Trash } from "lucide-react"
// import { useEffect, useState } from "react"
// import axios from "axios"
// // Mock data for user interviews

// export function UserInterviews() {
//     const [interviews, setInterviews] = useState([])

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             console.error('No token found');
//             return;
//         }

//         axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/interviews`, {
//             headers: { Authorization: `Bearer ${token}` }
//         })
//         .then(response => setInterviews(response.data))
//         .catch(error => console.error('Error fetching profile data:', error));
//     }, []);
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-bold">My Interviews</h2>
//         <Button asChild>
//           <Link href="/submit">Share New Experience</Link>
//         </Button>
//       </div>

//       <div className="grid gap-6">
//         {interviews.map((interview, index) => (
//           <Card key={index}>
//             <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
//               <div>
//                 <CardTitle className="text-xl">{interview.company}</CardTitle>
//                 <div className="text-sm text-muted-foreground mt-1">
//                   {interview.role} • {interview.level}
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 {interview.status === "draft" && <Badge variant="outline">Draft</Badge>}
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="icon">
//                       <MoreHorizontal className="h-4 w-4" />
//                       <span className="sr-only">Actions</span>
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem>
//                       <Edit className="mr-2 h-4 w-4" />
//                       Edit
//                     </DropdownMenuItem>
//                     <DropdownMenuItem className="text-destructive">
//                       <Trash className="mr-2 h-4 w-4" />
//                       Delete
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center text-sm text-muted-foreground">
//                 <Calendar className="mr-1 h-3 w-3" />
//                 <span>Posted on {interview.date}</span>
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-between">
//               <div className="text-sm text-muted-foreground">
//                 {interview.status === "published" ? (
//                   <>
//                     {interview.views} views • {interview.likes} likes • {interview.comments} comments
//                   </>
//                 ) : (
//                   "Not published yet"
//                 )}
//               </div>
//               <Button variant="outline" size="sm" asChild>
//                 <Link href={`/interviews/${interview.id}`}>
//                   {interview.status === "published" ? "View" : "Continue Editing"}
//                 </Link>
//               </Button>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }


"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, Edit, MoreHorizontal, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"

export function UserInterviews() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState('');       // Error state

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            setError("No token found. Please log in again.");
            setLoading(false);
            return;
        }

        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/interviews`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        .then(response => setInterviews(response.data))
        .catch(() => setError('Failed to fetch interviews. Please try again.'))
        .finally(() => setLoading(false));
    }, []);
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Interviews</h2>
                <Button asChild>
                    <Link href="/submit">Share New Experience</Link>
                </Button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center h-40">
                    <span className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></span>
                </div>
            )}

            {/* Error Message */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Interview Cards */}
            {!loading && !error && (
                <div className="grid gap-6">
                    {interviews.length > 0 ? (
                        interviews.map((interview: {
                            id: string;
                            company: string;
                            role: string;
                            level: string;
                            status: string;
                            date: string;
                            views?: number;
                            likes?: number;
                            comments?: number;
                        }) => (
                            <Card key={interview.id}>
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                    <div>
                                        <CardTitle className="text-xl">{interview.company}</CardTitle>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            {interview.role} • {interview.level}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {interview.status === "draft" && (
                                            <Badge variant="outline">Draft</Badge>
                                        )}
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
                        ))
                    ) : (
                        <p className="text-muted-foreground">No interviews found.</p>
                    )}
                </div>
            )}
        </div>
    )
}
