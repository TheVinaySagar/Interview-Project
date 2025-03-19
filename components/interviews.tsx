"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, ThumbsUp, Loader2, Building, UserCircle2 } from "lucide-react";
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
      <div className="flex h-64 items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading interviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-medium">No interviews found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or check back later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {interviews.map((interview) => (
        <Link
          href={`/interviews/${interview._id}`}
          key={interview._id}
          className="group block"
        >
          <Card className="h-full border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30">
            <CardHeader className="p-6 pb-4 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-primary" />
                    <CardTitle className="text-xl font-bold tracking-tight leading-tight">
                      {interview.company}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">
                      {interview.role}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "px-3 py-1 text-xs font-semibold rounded-full",
                    interview.level === "Senior" && "bg-blue-50 text-blue-700 border-blue-200",
                    interview.level === "Mid" && "bg-green-50 text-green-700 border-green-200",
                    interview.level === "Junior" && "bg-purple-50 text-purple-700 border-purple-200"
                  )}
                >
                  {interview.level}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="px-6 py-3">
              <div className="flex flex-wrap gap-2">
                {interview.tags?.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2.5 py-1 bg-secondary/30 rounded-md"
                  >
                    {tag}
                  </Badge>
                ))}
                {!interview.tags?.length &&
                  <span className="text-xs text-muted-foreground">No tags</span>
                }
              </div>
            </CardContent>

            <CardFooter className="px-6 py-4 border-t bg-muted/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-9 w-9 ring-2 ring-background">
                  <AvatarImage src={interview.authorAvatar} alt={interview.author?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
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

              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1.5 group-hover:text-primary transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-xs font-medium">{interview.likes || 0}</span>
                </div>
                <div className="flex items-center space-x-1.5 group-hover:text-primary transition-colors">
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
