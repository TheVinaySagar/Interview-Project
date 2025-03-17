// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import Link from "next/link";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Calendar, MessageSquare, ThumbsUp } from "lucide-react";
// import { useSearchParams } from "next/navigation";


// export function Interviews() {
//   // const router = useRouter();
//   const [interviews, setInterviews] = useState([]);
//   const [loading, setLoading] = useState(true); // Added loading state
//   const [error, setError] = useState("");       // Added error state

//   useEffect(() => {
//     axios
//       .get(`${process.env.NEXT_PUBLIC_API_URL}/interviews`)
//       .then(response => {
//         setInterviews(response.data);
//       })
//       .catch(() => setError("Failed to fetch interviews. Please try again."))
//       .finally(() => setLoading(false));
//   }, []);
//   const searchParams = useSearchParams();
//   useEffect(() => {
//     const fetchInterviews = async () => {
//       try {
//         const queryParams = searchParams.toString();
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/interviews?${queryParams}`);
//         setInterviews(response.data);
//       } catch (err) {
//         setError("Failed to fetch interviews. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInterviews();
//   }, [searchParams]);




//   if (loading) return <p className="text-center py-4">Loading interviews...</p>;
//   if (error) return <p className="text-center text-red-500 py-4">{error}</p>;

//   return (
//     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
//       {interviews.map((interview: any) => (
//         <Link href={`/interviews/${interview._id}`} key={interview._id}>
//           <Card className="overflow-hidden hover:shadow-md transition-shadow">
//             <CardHeader className="p-4 pb-2">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <CardTitle className="text-xl">{interview.company}</CardTitle>
//                   <div className="text-sm text-muted-foreground mt-1">
//                     {interview.role}
//                   </div>
//                 </div>
//                 <Badge variant="outline" className="ml-2">
//                   {interview.level}
//                 </Badge>
//               </div>
//             </CardHeader>
//             <CardContent className="p-4 pt-2 min-h-0">
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {interview.tags?.map((tag: string, index: number) => (
//                   <Badge key={index} variant="secondary" className="text-xs">
//                     {tag}
//                   </Badge>
//                 ))}
//               </div>
//             </CardContent>
//             <CardFooter className="p-4 pt-0 flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <Avatar className="h-8 w-8">
//                   <AvatarImage src={interview.authorAvatar} alt={interview.author?.name} />
//                   <AvatarFallback>{interview.author?.initials || "NA"}</AvatarFallback>
//                 </Avatar>
//                 <div className="text-sm">
//                   <p className="font-medium">{interview.authorName || "Unknown Author"}</p>
//                   <div className="flex items-center text-muted-foreground">
//                     <Calendar className="mr-1 h-3 w-3" />
//                     <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2 text-muted-foreground">
//                 <div className="flex items-center">
//                   <ThumbsUp className="mr-1 h-4 w-4" />
//                   <span className="text-xs">{interview.likes || 0}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <MessageSquare className="mr-1 h-4 w-4" />
//                   <span className="text-xs">{interview.comments || 0}</span>
//                 </div>
//               </div>
//             </CardFooter>
//           </Card>
//         </Link>
//       ))}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, ThumbsUp, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type Interview = {
  _id: string;
  company: string;
  role: string;
  level: string;
  tags?: string[];
  authorName: string;
  authorAvatar?: string;
  author?: { name: string; initials: string };
  createdAt: string;
  likes: number;
  comments: number;
};

export function Interviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const queryParams = searchParams.toString();
        const response = await axios.get<Interview[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/interviews?${queryParams}`
        );
        setInterviews(response.data);
      } catch (err) {
        setError("Failed to fetch interviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading interviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {interviews.map((interview) => (
        <Link
          href={`/interviews/${interview._id}`}
          key={interview._id}
          className="block transition-transform hover:scale-[1.02] duration-200"
        >
          <Card className="h-full border-2 hover:border-primary/20 hover:shadow-lg transition-all duration-200">
            <CardHeader className="p-5 pb-3">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1.5">
                  <CardTitle className="text-xl font-bold tracking-tight">
                    {interview.company}
                  </CardTitle>
                  <p className="text-sm font-medium text-muted-foreground">
                    {interview.role}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "px-2.5 py-0.5 text-xs font-semibold",
                    interview.level === "Senior" && "bg-blue-50 text-blue-700 border-blue-200",
                    interview.level === "Mid" && "bg-green-50 text-green-700 border-green-200",
                    interview.level === "Junior" && "bg-purple-50 text-purple-700 border-purple-200"
                  )}
                >
                  {interview.level}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="px-5 py-3">
              <div className="flex flex-wrap gap-1.5">
                {interview.tags?.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-0.5 bg-secondary/30"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className="px-5 py-4 border-t bg-muted/5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 ring-2 ring-background">
                  <AvatarImage src={interview.authorAvatar} alt={interview.author?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {interview.author?.initials || interview.authorName?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {interview.authorName || "Unknown Author"}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    <time dateTime={interview.createdAt}>
                      {new Date(interview.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-xs font-medium">{interview.likes || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs font-medium">{interview.comments || 0}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
