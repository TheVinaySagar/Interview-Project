"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { formSchema } from "@/components/types/formtypes"
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAuth } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import {popularTags} from "@/components/types/datatypes"

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const questionVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
  exit: { opacity: 0, height: 0 },
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

// Dynamic import for RichTextEditor
const RichTextEditor = dynamic(
  () => import("@/components/rich-text-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[200px] bg-gray-100 animate-pulse rounded-md" />
    ),
  }
);

type FormValues = z.infer<typeof formSchema>;

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
      questions: [],
      experience: "",
      tips: "",
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
    if (e.key === "Enter" || e.key === ",") {
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
    const newTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(newTags);
    form.setValue("tags", newTags);
  };

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

  // Submit form
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to submit an interview");
      return;
    }
    console.log("Submitting interview data:", data);
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();

      const payload = {
        ...data,
        tips: data.tips?.trim() || "",
        authorId: user.uid,
        authorName: data.isAnonymous
          ? "Anonymous"
          : user.displayName || user.email,
      };

      const cleanExperience = data.experience.replace(/<[^>]+>/g, " ").trim();
      if (cleanExperience.length < 10) {
        form.setError("experience", {
          type: "manual",
          message: "Please provide meaningful content",
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
          ? "Your interview experience has been submitted for approval!"
          : "Your interview has been saved as a draft"
      );
      router.push(
        response.data.interview.status === "published"
          ? `/interviews/${response.data.interview._id}`
          : "/profile"
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Submission failed");
      } else {
        toast.error("An unexpected error occurred");
      }
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-[50vh]"
      >
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </motion.div>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto px-4 py-10"
      >
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You need to be logged in to share your interview experience.</p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => router.push("/login")}>Log In</Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto px-4 py-10"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="text-3xl font-bold mb-6">
          Share Your Interview Experience
        </motion.h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Company and Job Details */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company*</FormLabel>
                    <FormControl>
                      <motion.div whileFocus={{ scale: 1.01 }}>
                        <Input placeholder="e.g. Google" {...field} />
                      </motion.div>
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
                      <motion.div whileFocus={{ scale: 1.01 }}>
                        <Input
                          placeholder="e.g. Software Engineer"
                          {...field}
                        />
                      </motion.div>
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
                        <motion.div whileHover={{ scale: 1.01 }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </motion.div>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="fresher">
                          Entry Level/Fresher
                        </SelectItem>
                        <SelectItem value="experienced">Experienced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Interview Experience */}
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Experience*</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder="Share your overall interview experience, process, and timeline..."
                      />
                    </FormControl>
                    <FormDescription>
                      Describe your interview journey, what to expect, and any
                      insights that might help others.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Interview Questions */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel className="text-base">
                  Interview Questions & Answers
                </FormLabel>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addQuestion}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </motion.div>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {form.watch("questions")?.map((_, index) => (
                    <motion.div
                      key={index}
                      variants={questionVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="p-4 border rounded-lg space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        {index > 0 && (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
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
                          </motion.div>
                        )}
                      </div>

                      <FormField
                        control={form.control}
                        name={`questions.${index}.question`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question</FormLabel>
                            <FormControl>
                              <motion.div whileFocus={{ scale: 1.01 }}>
                                <Input
                                  placeholder="What was the interview question?"
                                  {...field}
                                />
                              </motion.div>
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
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                placeholder="What was your answer or solution?"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div variants={itemVariants}>
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
                          field.onChange(value || "");
                        }}
                        placeholder="Any tips for others preparing for similar interviews?"
                      />
                    </FormControl>
                    <FormDescription>
                      Share preparation resources, study tips, or any other
                      advice.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Tags */}
            <motion.div variants={itemVariants} className="space-y-4">
              <FormLabel className="text-base">Tags*</FormLabel>
              <FormDescription>
                Add relevant tags to help others find your interview experience.
              </FormDescription>

              <div className="flex flex-wrap gap-2 mb-4">
                <AnimatePresence>
                  {selectedTags.map((tag) => (
                    <motion.div
                      key={tag}
                      layout
                      variants={tagVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ type: "spring" }}
                    >
                      <Badge
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
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex gap-2">
                <motion.div whileFocus={{ scale: 1.01 }} className="flex-1">
                  <Input
                    placeholder="Type a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (
                        tagInput.trim() &&
                        !selectedTags.includes(tagInput.trim())
                      ) {
                        addTag(tagInput.trim());
                        setTagInput("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </motion.div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Popular Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {popularTags
                    .filter((tag) => !selectedTags.includes(tag))
                    .slice(0, 10)
                    .map((tag) => (
                      <motion.div
                        key={tag}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => addTag(tag)}
                        >
                          {tag}
                        </Badge>
                      </motion.div>
                    ))}
                </div>
              </div>

              {form.formState.errors.tags && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.tags.message}
                </p>
              )}
            </motion.div>

            {/* Privacy and Publishing Options */}
            <motion.div variants={itemVariants} className="space-y-6">
              <FormField
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                  <Card className="p-4">
                    <CardContent>
                      <FormItem className="flex items-center space-x-4">
                        <FormControl>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="h-5 w-5 border-gray-400 data-[state=checked]:bg-blue-500 transition-all"
                              aria-label="Submit anonymously"
                            />
                          </motion.div>
                        </FormControl>
                        <div>
                          <FormLabel className="text-base font-medium">
                            Submit Anonymously
                          </FormLabel>
                          <FormDescription className="text-gray-500">
                            Your name will not be displayed with this interview
                            experience.
                          </FormDescription>
                        </div>
                      </FormItem>
                    </CardContent>
                  </Card>
                )}
              />
            </motion.div>

            {/* Publication Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <motion.div variants={itemVariants}>
                  <FormItem className="space-y-4">
                    <FormLabel className="text-lg font-semibold">
                      Publication Status
                    </FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Draft Option */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => field.onChange("draft")}
                          className={`
                relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                ${
                  field.value === "draft"
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }
              `}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`
                  h-4 w-4 rounded-full border-2 transition-all
                  ${
                    field.value === "draft"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }
                `}
                            >
                              {field.value === "draft" && (
                                <div className="h-full w-full rounded-full bg-white scale-50" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">
                                  Save as Draft
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  Private
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                Only visible to you. You can edit and publish
                                later.
                              </p>
                            </div>
                          </div>
                          {field.value === "draft" && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center"
                            >
                              <div className="h-2 w-2 rounded-full bg-white" />
                            </motion.div>
                          )}
                        </motion.div>

                        {/* Published Option */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => field.onChange("published")}
                          className={`
                relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                ${
                  field.value === "published"
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }
              `}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`
                  h-4 w-4 rounded-full border-2 transition-all
                  ${
                    field.value === "published"
                      ? "border-green-500 bg-green-500"
                      : "border-gray-300"
                  }
                `}
                            >
                              {field.value === "published" && (
                                <div className="h-full w-full rounded-full bg-white scale-50" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">
                                  Publish Now
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-xs border-green-500 text-green-700"
                                >
                                  Public
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                Share with the community. Subject to review.
                              </p>
                            </div>
                          </div>
                          {field.value === "published" && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center"
                            >
                              <div className="h-2 w-2 rounded-full bg-white" />
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      {field.value === "draft"
                        ? "Your interview will be saved privately and you can publish it later from your profile."
                        : "Your interview will be shared publicly after a quick review process."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </motion.div>
              )}
            />

            {/* Submit Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex justify-end space-x-4"
            >
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You have unsaved changes. Are you sure you want to discard
                      them?
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

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
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
              </motion.div>
            </motion.div>
          </form>
        </Form>
      </motion.div>
    </motion.div>
  );
}
