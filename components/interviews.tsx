"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, ThumbsUp } from "lucide-react";
import { useSearchParams } from "next/navigation";


export function Interviews() {
  // const router = useRouter();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState("");       // Added error state

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/interviews`)
      .then(response => {
        setInterviews(response.data);
      })
      .catch(() => setError("Failed to fetch interviews. Please try again."))
      .finally(() => setLoading(false));
  }, []);
  const searchParams = useSearchParams();
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const queryParams = searchParams.toString(); // ✅ URL query params le rahe hain
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/interviews?${queryParams}`);
        setInterviews(response.data);
      } catch (err) {
        setError("Failed to fetch interviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [searchParams]);




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
                    {interview.role}
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
                  <AvatarImage src={interview.authorAvatar} alt={interview.author?.name} />
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
