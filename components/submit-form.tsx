"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAuth } from "firebase/auth";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import dynamic from "next/dynamic";

// Modify your dynamic import:
const RichTextEditor = dynamic(
  () => import('@/components/rich-text-editor').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="h-[200px] bg-gray-100 animate-pulse rounded-md" />
  }
);

// Form schema based on your Interview model
const formSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Job role is required"),
  level: z.enum(["internship", "fresher", "experienced"], {
    required_error: "Please select a level",
  }),
  questions: z.array(
    z.object({
      question: z.string().min(1, "Question is required"),
      answer: z.string().refine((val) =>
        val.replace(/<[^>]+>/g, '').trim().length >= 10,
        "Please provide a substantial answer"
      ),
    })
  ).min(1, "At least one question is required"),
  experience: z.string().refine((val) =>
    val.replace(/<[^>]+>/g, '').trim().length >= 10,
    "Please share at least 10 characters of meaningful content"
  ),
  tips: z.string().optional().transform(val => val || ''), // Transform empty string to valid empty string
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  isAnonymous: z.boolean().default(false),
  status: z.enum(["draft", "published"], {
    required_error: "Please select a status",
  }),
});

type FormValues = z.infer<typeof formSchema>;

// Popular interview tags
const popularTags = [
  "frontend", "backend", "fullstack", "devops", "mobile",
  "react", "angular", "vue", "node", "express", "django", "spring",
  "javascript", "typescript", "python", "java", "c#", "go", "rust",
  "data-structures", "algorithms", "system-design", "behavioral",
  "remote", "onsite", "leetcode", "take-home", "coding-challenge"
];

export default function SubmitInterview() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      role: "",
      level: "fresher",
      questions: [{ question: "", answer: "" }],
      experience: "",
      tips: '', // Initialize with empty string
      tags: [],
      isAnonymous: false,
      status: "draft",
    },
  });

  // Check authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // Handle tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
        const newTags = [...selectedTags, tagInput.trim()];
        setSelectedTags(newTags);
        form.setValue("tags", newTags);
        setTagInput("");
      }
    }
  };

  // Add a tag
  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      form.setValue("tags", newTags);
    }
  };

  // Remove a tag
  const removeTag = (tag: string) => {
    const newTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(newTags);
    form.setValue("tags", newTags);
  };

  // Add a new question/answer pair
  const addQuestion = () => {
    const currentQuestions = form.getValues("questions") || [];
    form.setValue("questions", [...currentQuestions, { question: "", answer: "" }]);
  };

  // Remove a question/answer pair
  const removeQuestion = (index: number) => {
    const currentQuestions = form.getValues("questions");
    if (currentQuestions.length > 1) {
      form.setValue(
        "questions",
        currentQuestions.filter((_, i) => i !== index)
      );
    }
  };

  // Submit form
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to submit an interview");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();

      // Clean and prepare the data
      const payload = {
        ...data,
        tips: data.tips?.trim() || '', // Ensure tips is always a string
        authorId: user.uid,
        authorName: data.isAnonymous ? "Anonymous" : user.displayName || user.email,
      };

      // Validate experience content
      const cleanExperience = data.experience.replace(/<[^>]+>/g, ' ').trim();
      if (cleanExperience.length < 10) {
        form.setError('experience', {
          type: 'manual',
          message: 'Please provide meaningful content'
        });
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/interviews`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        data.status === "published"
          ? "Your interview experience has been gone to approval!"
          : "Your interview has been saved as a draft"
      );
      router.push(
        response.data.interview.status === "published"
          ? `/interviews/${response.data.interview._id}`
          : "/profile"
      );
    } catch (error) {
      // Enhanced error handling
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Submission failed');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  // If loading, show spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You need to be logged in to share your interview experience.</p>
            <Button onClick={() => router.push("/login")}>
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Share Your Interview Experience</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Company and Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Level*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
          </div>

          {/* Interview Experience */}
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interview Experience*</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    placeholder="Share your overall interview experience, process, and timeline..."
                  />
                </FormControl>
                <FormDescription>
                  Describe your interview journey, what to expect, and any insights that might help others.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Interview Questions */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <FormLabel className="text-base">Interview Questions & Answers*</FormLabel>
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

            <div className="space-y-4">
              {form.watch("questions")?.map((_, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Question {index + 1}</h4>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Minus className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`questions.${index}.question`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                          <Input placeholder="What was the interview question?" {...field} />
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
                        <FormLabel>Answer</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="What was your answer or solution?"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <FormField
            control={form.control}
            name="tips"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tips & Advice (Optional)</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value || ''); // Ensure empty string if value is null/undefined
                    }}
                    placeholder="Any tips for others preparing for similar interviews?"
                  />
                </FormControl>
                <FormDescription>
                  Share preparation resources, study tips, or any other advice.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tags */}
          <div className="space-y-4">
            <FormLabel className="text-base">Tags*</FormLabel>
            <FormDescription>
              Add relevant tags to help others find your interview experience.
            </FormDescription>

            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1 py-1 px-3"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="rounded-full h-4 w-4 inline-flex items-center justify-center text-xs hover:bg-muted"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Type a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
                    addTag(tagInput.trim());
                    setTagInput("");
                  }
                }}
              >
                Add
              </Button>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Popular Tags</h4>
              <div className="flex flex-wrap gap-2">
                {popularTags.filter(tag => !selectedTags.includes(tag)).slice(0, 10).map(tag => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {form.formState.errors.tags && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.tags.message}
              </p>
            )}
          </div>

          {/* Privacy and Publishing Options */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="isAnonymous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Submit anonymously</FormLabel>
                    <FormDescription>
                      Your name will not be displayed with this interview experience.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publish Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Save as Draft</SelectItem>
                      <SelectItem value="published">Publish Now</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Drafts are only visible to you. Published interviews are publicly visible.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You have unsaved changes. Are you sure you want to discard them?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Continue Editing</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => router.push("/profile/interviews")}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Discard Changes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : form.watch("status") === "published" ? (
                "Publish Experience"
              ) : (
                "Save as Draft"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
