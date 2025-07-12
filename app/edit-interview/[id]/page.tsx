"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAuth } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { popularTags } from "@/components/types/datatypes";
import { formSchema } from "@/components/types/formtypes";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


type FormValues = z.infer<typeof formSchema>;

export default function EditInterview() {
  const params = useParams();
  const interviewId = params?.id as string;
  const router = useRouter();
  const auth = getAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const preStatus = useRef<string>("");
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      role: "",
      level: "fresher",
      questions: [{ question: "", answer: "" }],
      experience: "",
      tips: "",
      tags: [],
      isAnonymous: false,
      status: "draft",
    },
  });

  // Fetch interview data on mount
  useEffect(() => {
    const fetchInterview = async () => {
      if (!interviewId) return;

      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/interviews/${interviewId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = response.data;
        preStatus.current = data.status;
        setSelectedTags(data.tags || []);

        form.reset({
          company: data.company,
          role: data.role,
          level: data.level,
          questions:
            data.questions.length > 0
              ? data.questions
              : [{ question: "", answer: "" }],
          experience: data.experience,
          tips: data.tips || "",
          tags: data.tags,
          isAnonymous: data.isAnonymous,
          status: data.status,
        });
      } catch (err: any) {
        console.error("Error fetching interview:", err);
        setError(
          err.response?.status === 404
            ? "Interview not found"
            : "Failed to load interview"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId, auth, form]);

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (!auth.currentUser) {
      toast.error("Please sign in to continue");
      return;
    }
    setIsSubmitting(true);

    try {
      const token = await auth.currentUser.getIdToken();
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/interviews/${interviewId}`,
        {
          ...data,
          authorId: auth.currentUser.uid,
          authorName: data.isAnonymous
            ? "Anonymous"
            : auth.currentUser.displayName,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Interview updated successfully");
      router.push("/profile");
    } catch (err) {
      console.error("Error updating interview:", err);
      toast.error("Failed to update interview");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle tag input
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim();

      if (tag && !selectedTags.includes(tag)) {
        const newTags = [...selectedTags, tag];
        setSelectedTags(newTags);
        form.setValue("tags", newTags);
      }

      setTagInput("");
    }
  };

  // Add/remove questions
  // Add a new question/answer pair
  const addQuestion = () => {
    const currentQuestions = form.getValues("questions") || [];
    form.setValue("questions", [
      ...currentQuestions,
      { question: "", answer: "" },
    ]);
  };

  // Remove a question/answer pair
  const removeQuestion = (index: number) => {
    const currentQuestions = form.getValues("questions") || [];
    if (currentQuestions.length > 1) {
      form.setValue(
        "questions",
        currentQuestions.filter((_, i) => i !== index)
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/profile")}>
              Back to My Interviews
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Interview Experience</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company*</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Google" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Role*</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level*</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="fresher">Entry Level/Fresher</SelectItem>
                    <SelectItem value="experienced">Experienced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interview Experience*</FormLabel>
                <FormControl>
                  <div
                    contentEditable
                    className="min-h-[200px] max-h-[300px] p-3 border rounded-md focus:outline-none overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: field.value || "" }}
                    onBlur={(e) => field.onChange(e.target.innerHTML)} // Save formatted content
                    style={{ whiteSpace: "pre-wrap" }} // Ensures text wraps properly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>Questions & Answers*</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addQuestion}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            {form.watch("questions")?.map((_, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Question {index + 1}</h4>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name={`questions.${index}.question`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter the question" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`questions.${index}.answer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div
                          contentEditable
                          className="min-h-[100px] max-h-[200px] p-3 border rounded-md focus:outline-none overflow-y-auto"
                          dangerouslySetInnerHTML={{
                            __html: field.value || "",
                          }}
                          onBlur={(e) => field.onChange(e.target.innerHTML)} // Save formatted content
                          style={{ whiteSpace: "pre-wrap" }} // Ensures text wraps properly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel>Tags*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type a tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInput}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                  <button
                    type="button"
                    className="ml-2 hover:text-destructive"
                    onClick={() => {
                      setSelectedTags((tags) => tags.filter((t) => t !== tag));
                      form.setValue(
                        "tags",
                        selectedTags.filter((t) => t !== tag)
                      );
                    }}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    if (!selectedTags.includes(tag)) {
                      setSelectedTags((tags) => [...tags, tag]);
                      form.setValue("tags", [...selectedTags, tag]);
                    }
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <FormField
            control={form.control}
            name="tips"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tips & Advice (Optional)</FormLabel>
                <FormControl>
                  <div
                    contentEditable
                    className="min-h-[100px] max-h-[200px] p-3 border rounded-md focus:outline-none overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: field.value || "" }}
                    onBlur={(e) => field.onChange(e.target.innerHTML)} // Save formatted content
                    style={{ whiteSpace: "pre-wrap" }} // Ensures text wraps properly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium">
                  Publication Status
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {/* Draft Option - Only show if current status allows it */}
                    {preStatus.current !== "pending" &&
                      preStatus.current !== "published" && (
                        <label
                          className={`
                flex items-center p-3 rounded-lg border cursor-pointer transition-colors
                ${
                  field.value === "draft"
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }
              `}
                        >
                          <input
                            type="radio"
                            name="status"
                            value="draft"
                            checked={field.value === "draft"}
                            onChange={() => field.onChange("draft")}
                            className="sr-only"
                          />
                          <div
                            className={`
                w-4 h-4 rounded-full border-2 mr-3
                ${
                  field.value === "draft"
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }
              `}
                          >
                            {field.value === "draft" && (
                              <div className="w-full h-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                Save as Draft
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                Private
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-0.5">
                              Keep private and edit later
                            </p>
                          </div>
                        </label>
                      )}

                    {/* Publish Option */}
                    <label
                      className={`
              flex items-center p-3 rounded-lg border cursor-pointer transition-colors
              ${
                field.value === "pending"
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 hover:bg-gray-50"
              }
            `}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="pending"
                        checked={field.value === "pending"}
                        onChange={() => field.onChange("pending")}
                        className="sr-only"
                      />
                      <div
                        className={`
              w-4 h-4 rounded-full border-2 mr-3
              ${
                field.value === "pending"
                  ? "border-green-500 bg-green-500"
                  : "border-gray-300"
              }
            `}
                      >
                        {field.value === "pending" && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {preStatus.current === "published"
                              ? "Update Published"
                              : "Publish Interview"}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                            {preStatus.current === "published"
                              ? "Update"
                              : "Public"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {preStatus.current === "published"
                            ? "Submit changes for review"
                            : "Share with community after review"}
                        </p>
                      </div>
                    </label>
                  </div>
                </FormControl>

                <FormDescription className="text-sm text-gray-600">
                  {field.value === "draft"
                    ? "Saved privately - you can edit anytime"
                    : "Will be reviewed before publishing"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4 pt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Any unsaved changes will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Continue Editing</AlertDialogCancel>
                  <AlertDialogAction onClick={() => router.push("/profile")}>
                    Discard Changes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
