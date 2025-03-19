"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, MessageSquare, Calendar, Loader2, TrendingUp, Eye } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { cn } from "@/lib/utils";

type TrendingInterview = {
  _id: string;
  company: string;
  role: string;
  level: string;
  createdAt: string;
  likes: number;
  comments: number;
  views: number;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  tags: string[];
  status: string;
  isAnonymous: boolean;
};

interface TrendingInterviewsProps {
  className?: string;
}

export function TrendingInterviews({ className }: TrendingInterviewsProps) {
  const [interviews, setInterviews] = useState<TrendingInterview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingInterviews = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/interviews/trending`);
        setInterviews(data.slice(0, 3)); // Only take 3 interviews
      } catch (error) {
        console.error("Error fetching trending interviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingInterviews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className={`py-16 px-4 md:px-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl ${className}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Trending Interviews</h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {interviews.map((interview) => (
            <Link href={`/interviews/${interview._id}`} key={interview._id} className="group">
              <Card className="h-full border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 rounded-xl overflow-hidden">
                <CardHeader className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">{interview.company}</CardTitle>
                      <div className="text-sm text-gray-600 mt-1">{interview.role}</div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "px-3 py-1 text-xs font-semibold capitalize",
                        interview.level === "internship" && "bg-purple-50 text-purple-700 border-purple-300",
                        interview.level === "fresher" && "bg-green-50 text-green-700 border-green-300",
                        interview.level === "experienced" && "bg-blue-50 text-blue-700 border-blue-300"
                      )}
                    >
                      {interview.level}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {interview.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5 bg-secondary/40">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-6 flex items-center justify-between bg-gray-50 border-t">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9 ring-2 ring-gray-300">
                      <AvatarImage src={interview.authorAvatar || undefined} alt="Author" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {interview.isAnonymous ? "A" : interview.authorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        {interview.isAnonymous ? "Anonymous" : interview.authorName}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="mr-1 h-3 w-3" />
                        <time dateTime={interview.createdAt}>
                          {new Date(interview.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-500">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-xs font-medium">{interview.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-xs font-medium">{interview.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span className="text-xs font-medium">{interview.views}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
