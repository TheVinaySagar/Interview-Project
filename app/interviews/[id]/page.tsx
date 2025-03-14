// "use client"

// import { useEffect, useState } from "react"
// import { useParams } from "next/navigation"
// import axios from "axios"
// import Link from "next/link"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { ThumbsUp, MessageSquare, Share2, Calendar, Building, Briefcase, Award } from "lucide-react"
// import { InterviewComments } from "@/components/interview-comments"
// import ReactMarkdown from "react-markdown";
// import LikeButton from "@/components/LikeButton";

// export default function InterviewDetailPage() {
//   const { id } = useParams() // Extract the ID from the URL

//   const [interview, setInterview] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     if (!id) return

//     axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/interviews/${id}`)
//       .then(response => {
//         setInterview(response.data)
//         console.log(response.data)
//         setLoading(false)
//       })
//       .catch(() => {
//         setError("Failed to load interview details. Please try again.")
//         setLoading(false)
//       })
//   }, [id])

//   if (loading) return <p className="text-center py-10">Loading...</p>
//   if (error) return <p className="text-center text-red-500">{error}</p>
//   if (!interview) return <p className="text-center py-10">No interview found.</p>

//   return (
//     <div className="container py-10">
//       <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
//         <div className="space-y-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <LikeButton
//                 interviewId={interview._id}
//                 initialLikes={interview.likes}
//                 userLiked={interview.likedBy.includes(auth.currentUser?.uid)}
//               />
//               <Button variant="ghost" size="icon" className="rounded-full">
//                 <MessageSquare className="h-5 w-5" />
//               </Button>
//               <span className="font-medium">{interview.comments}</span>
//               <Button variant="ghost" size="icon" className="rounded-full">
//                 <Share2 className="h-5 w-5" />
//               </Button>
//             </div>
//             <Button variant="outline" asChild>
//               <Link href="/interviews">Back to Interviews</Link>
//             </Button>
//           </div>

//           <div className="space-y-2">
//             <h1 className="text-3xl font-bold">{interview.company} Interview Experience</h1>
//             <div className="flex flex-wrap gap-2">
//               {interview.tags.map((tag: string) => (
//                 <Badge key={tag} variant="secondary">
//                   {tag}
//                 </Badge>
//               ))}
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             <Avatar className="h-10 w-10">
//               <AvatarImage src={interview.author?.avatar} alt={interview.author?.name} />
//               <AvatarFallback>{interview.author?.initials || "NA"}</AvatarFallback>
//             </Avatar>
//             <div>
//               <p className="font-medium">{interview.authorName || "Unknown Author"}</p>
//               <div className="flex items-center text-sm text-muted-foreground">
//                 <Calendar className="mr-1 h-3 w-3" />
//                 <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
//               </div>
//             </div>
//           </div>

//           <Separator />

//           <div className="prose prose-sm dark:prose-invert max-w-none">
//             <ReactMarkdown>{interview.experience}</ReactMarkdown>
//           </div>

//           <div className="space-y-4">
//             <h2 className="text-2xl font-bold">Interview Questions</h2>
//             {interview.questions.map((q: any, i: number) => (
//               <Card key={i}>
//                 <CardContent className="p-4">
//                   <h3 className="font-bold">Q: {q.question}</h3>
//                   <p className="mt-2">A: {q.answer}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           <Separator />

//           <InterviewComments />
//         </div>

//         <div className="space-y-6">
//           <Card>
//             <CardContent className="p-4 space-y-4">
//               <h3 className="font-bold text-lg">Interview Details</h3>
//               <div className="space-y-2">
//                 <div className="flex items-center">
//                   <Building className="mr-2 h-4 w-4 text-muted-foreground" />
//                   <span>Company: {interview.company}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
//                   <span>Role: {interview.role}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Award className="mr-2 h-4 w-4 text-muted-foreground" />
//                   <span>Level: {interview.level}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
//                   <span>Date: {new Date(interview.createdAt).toLocaleDateString()}</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-4 space-y-4">
//               <h3 className="font-bold text-lg">Similar Interviews</h3>
//               <div className="space-y-2">
//                 <Link href="#" className="block hover:underline">
//                   Google - Product Manager
//                 </Link>
//                 <Link href="#" className="block hover:underline">
//                   Google - Data Scientist
//                 </Link>
//                 <Link href="#" className="block hover:underline">
//                   Microsoft - Software Engineer
//                 </Link>
//                 <Link href="#" className="block hover:underline">
//                   Amazon - Software Engineer
//                 </Link>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, MessageSquare, Share2, Calendar, Building, Briefcase, Award } from "lucide-react";
import { InterviewComments } from "@/components/interview-comments";
import ReactMarkdown from "react-markdown";
import LikeButton from "@/components/LikeButton";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function InterviewDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // ✅ Fetch interview data
  useEffect(() => {
    if (!id) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/interviews/${id}`)
      .then((response) => {
        setInterview(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load interview details. Please try again.");
        setLoading(false);
      });
  }, [id]);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!interview) return <p className="text-center py-10">No interview found.</p>;

  return (
    <div className="container py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {/* ✅ Like, Comment, Share Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <LikeButton
                interviewId={interview._id}
                initialLikes={interview.likes || 0} // ✅ Default to 0 if undefined
                userLiked={user ? (Array.isArray(interview.likedBy) ? interview.likedBy.includes(user.uid) : false) : false} // ✅ Ensure `likedBy` is an array
              />

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

          {/* ✅ Interview Title & Tags */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{interview.company} Interview Experience</h1>
            <div className="flex flex-wrap gap-2">
              {interview.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* ✅ Author Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={interview.authorAvatar} alt={interview.author?.name} />
              <AvatarFallback>{interview.author?.initials || "NA"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{interview.authorName || "Unknown Author"}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* ✅ Interview Experience Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{interview.experience}</ReactMarkdown>
          </div>

          {/* ✅ Interview Questions Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Interview Questions</h2>
            {interview.questions.map((q: any, i: number) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <h3 className="font-bold">Q: {q.question}</h3>
                  <p className="mt-2">A: {q.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator />

          {/* ✅ Comments Section */}
          <InterviewComments interviewId={interview._id} />
        </div>

        {/* ✅ Right Sidebar (Details + Similar Interviews) */}
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
                  <span>Date: {new Date(interview.createdAt).toLocaleDateString()}</span>
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
  );
}
