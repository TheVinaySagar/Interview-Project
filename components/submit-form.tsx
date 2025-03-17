// "use client"

// import * as React from "react"
// import { useRouter } from "next/navigation"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { Check, ChevronsUpDown, Plus, X } from "lucide-react"
// import { toast } from "sonner"
// import axios from "axios"

// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { useAuth } from "@/lib/auth-context"

// const companies = [
//   { label: "Google", value: "google" },
//   { label: "Amazon", value: "amazon" },
//   { label: "Microsoft", value: "microsoft" },
//   { label: "Apple", value: "apple" },
//   { label: "Meta", value: "meta" },
//   { label: "Netflix", value: "netflix" },
// ]

// const tags = [
//   { label: "DSA", value: "dsa" },
//   { label: "System Design", value: "system-design" },
//   { label: "Behavioral", value: "behavioral" },
//   { label: "SQL", value: "sql" },
//   { label: "ML", value: "ml" },
//   { label: "JavaScript", value: "javascript" },
//   { label: "React", value: "react" },
//   { label: "Java", value: "java" },
//   { label: "Python", value: "python" },
// ]

// const formSchema = z.object({
//   company: z.string().min(1, "Please select a company"),
//   otherCompany: z.string().optional(),
//   role: z.string().min(1, "Please enter the job role"),
//   level: z.string().min(1, "Please select an experience level"),
//   questions: z.array(
//     z.object({
//       question: z.string().min(1, "Question is required"),
//       answer: z.string().min(1, "Answer is required")
//     })
//   ).min(1, "Please add at least one question"),
//   experience: z.string().min(50, "Please provide a detailed experience (minimum 50 characters)"),
//   tags: z.array(z.string()).min(1, "Please select at least one tag"),
//   isAnonymous: z.boolean().default(false),
// })

// export function SubmitForm() {
//   const router = useRouter()
//   const { user } = useAuth()
//   const [isSubmitting, setIsSubmitting] = React.useState(false)

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       company: "",
//       otherCompany: "",
//       role: "",
//       level: "",
//       questions: [{ question: "", answer: "" }],
//       experience: "",
//       tags: [],
//       isAnonymous: false,
//     },
//   })

//   const [openCompany, setOpenCompany] = React.useState(false)
//   const [openTags, setOpenTags] = React.useState(false)

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     if (!user || !user.token) {
//       toast.error("You must be logged in to submit an interview experience")
//       router.push("/login")
//       return
//     }

//     try {
//       setIsSubmitting(true)

//       // Prepare the data
//       const interviewData = {
//         ...values,
//         company:
//           values.company === "other" ? values.otherCompany : companies.find((c) => c.value === values.company)?.label,
//       }

//       // Submit to API
//       await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/interviews`, interviewData, {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       })

//       toast.success("Interview experience submitted successfully!")
//       router.push("/interviews")
//     } catch (error: any) {
//       console.error("Error submitting interview:", error)
//       toast.error(error.response?.data?.message || "Failed to submit interview experience")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const watchCompany = form.watch("company")
//   const watchTags = form.watch("tags")
//   const watchQuestions = form.watch("questions")

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <Card>
//           <CardContent className="pt-6">
//             <div className="grid gap-6">
//               <div className="grid gap-4 sm:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="company"
//                   render={({ field }) => (
//                     <FormItem className="flex flex-col">
//                       <FormLabel>Company</FormLabel>
//                       <Popover open={openCompany} onOpenChange={setOpenCompany}>
//                         <PopoverTrigger asChild>
//                           <FormControl>
//                             <Button
//                               variant="outline"
//                               role="combobox"
//                               aria-expanded={openCompany}
//                               className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
//                             >
//                               {field.value
//                                 ? companies.find((company) => company.value === field.value)?.label || "Other"
//                                 : "Select company..."}
//                               <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                             </Button>
//                           </FormControl>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-full p-0">
//                           <Command>
//                             <CommandInput placeholder="Search company..." />
//                             <CommandList>
//                               <CommandEmpty>No company found.</CommandEmpty>
//                               <CommandGroup>
//                                 {companies.map((company) => (
//                                   <CommandItem
//                                     key={company.value}
//                                     value={company.value}
//                                     onSelect={(value) => {
//                                       form.setValue("company", value)
//                                       setOpenCompany(false)
//                                     }}
//                                   >
//                                     <Check
//                                       className={cn(
//                                         "mr-2 h-4 w-4",
//                                         company.value === field.value ? "opacity-100" : "opacity-0",
//                                       )}
//                                     />
//                                     {company.label}
//                                   </CommandItem>
//                                 ))}
//                                 <CommandItem
//                                   value="other"
//                                   onSelect={() => {
//                                     form.setValue("company", "other")
//                                     setOpenCompany(false)
//                                   }}
//                                 >
//                                   <Check
//                                     className={cn(
//                                       "mr-2 h-4 w-4",
//                                       "other" === field.value ? "opacity-100" : "opacity-0",
//                                     )}
//                                   />
//                                   Other
//                                 </CommandItem>
//                               </CommandGroup>
//                             </CommandList>
//                           </Command>
//                         </PopoverContent>
//                       </Popover>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {watchCompany === "other" && (
//                   <FormField
//                     control={form.control}
//                     name="otherCompany"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Other Company</FormLabel>
//                         <FormControl>
//                           <Input placeholder="Enter company name" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 )}

//                 <FormField
//                   control={form.control}
//                   name="role"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Job Role</FormLabel>
//                       <FormControl>
//                         <Input placeholder="e.g. Software Engineer, Data Scientist" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="level"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Experience Level</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select level" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="internship">Internship</SelectItem>
//                           <SelectItem value="fresher">Fresher</SelectItem>
//                           <SelectItem value="experienced">Experienced</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={form.control}
//                 name="questions"
//                 render={() => (
//                   <FormItem>
//                     <FormLabel>Interview Questions</FormLabel>
//                     <FormDescription>Add the questions and their answers.</FormDescription>

//                     <div className="space-y-4">
//                       {watchQuestions.map((item, index) => (
//                         <div key={index} className="space-y-2 border p-3 rounded-md">
//                           <Input
//                             placeholder={`Question ${index + 1}`}
//                             value={item.question}
//                             onChange={(e) => {
//                               const newQuestions = [...watchQuestions];
//                               newQuestions[index] = {
//                                 ...newQuestions[index],
//                                 question: e.target.value
//                               };
//                               form.setValue("questions", newQuestions);
//                             }}
//                           />
//                           <Textarea
//                             placeholder="Your answer..."
//                             value={item.answer}
//                             onChange={(e) => {
//                               const newQuestions = [...watchQuestions];
//                               newQuestions[index] = {
//                                 ...newQuestions[index],
//                                 answer: e.target.value
//                               };
//                               form.setValue("questions", newQuestions);
//                             }}
//                           />
//                           {index > 0 && (
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => {
//                                 const newQuestions = watchQuestions.filter((_, i) => i !== index);
//                                 form.setValue("questions", newQuestions);
//                               }}
//                             >
//                               <X className="h-4 w-4" />
//                             </Button>
//                           )}
//                         </div>
//                       ))}
//                       <Button
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         className="mt-2"
//                         onClick={() => {
//                           const questions = watchQuestions;
//                           form.setValue("questions", [...questions, { question: "", answer: "" }]);
//                         }}
//                       >
//                         <Plus className="mr-2 h-4 w-4" />
//                         Add Question
//                       </Button>
//                     </div>

//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />


//               <FormField
//                 control={form.control}
//                 name="experience"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Detailed Experience</FormLabel>
//                     <FormDescription>
//                       Describe your interview experience in detail. Include the interview process, types of questions
//                       asked, and any advice for future candidates.
//                     </FormDescription>
//                     <FormControl>
//                       <Textarea placeholder="Share your interview experience..." className="min-h-[200px]" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="tags"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Tags</FormLabel>
//                     <FormDescription>Select tags that best describe your interview experience.</FormDescription>
//                     <div className="flex flex-wrap gap-2 mb-2">
//                       {watchTags.map((tag) => (
//                         <Badge key={tag} variant="secondary">
//                           {tags.find((t) => t.value === tag)?.label}
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             className="h-auto p-0 ml-1"
//                             onClick={() => {
//                               form.setValue(
//                                 "tags",
//                                 watchTags.filter((t) => t !== tag),
//                               )
//                             }}
//                           >
//                             <X className="h-3 w-3" />
//                             <span className="sr-only">Remove</span>
//                           </Button>
//                         </Badge>
//                       ))}
//                     </div>
//                     <Popover open={openTags} onOpenChange={setOpenTags}>
//                       <PopoverTrigger asChild>
//                         <FormControl>
//                           <Button
//                             variant="outline"
//                             role="combobox"
//                             aria-expanded={openTags}
//                             className="w-full justify-between"
//                           >
//                             Select tags...
//                             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                           </Button>
//                         </FormControl>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-full p-0">
//                         <Command>
//                           <CommandInput placeholder="Search tags..." />
//                           <CommandList>
//                             <CommandEmpty>No tag found.</CommandEmpty>
//                             <CommandGroup>
//                               {tags.map((tag) => (
//                                 <CommandItem
//                                   key={tag.value}
//                                   value={tag.value}
//                                   onSelect={(value) => {
//                                     form.setValue(
//                                       "tags",
//                                       watchTags.includes(value)
//                                         ? watchTags.filter((t) => t !== value)
//                                         : [...watchTags, value],
//                                     )
//                                   }}
//                                 >
//                                   <Check
//                                     className={cn(
//                                       "mr-2 h-4 w-4",
//                                       watchTags.includes(tag.value) ? "opacity-100" : "opacity-0",
//                                     )}
//                                   />
//                                   {tag.label}
//                                 </CommandItem>
//                               ))}
//                             </CommandGroup>
//                           </CommandList>
//                         </Command>
//                       </PopoverContent>
//                     </Popover>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="isAnonymous"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                     <FormControl>
//                       <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                     </FormControl>
//                     <div className="space-y-1 leading-none">
//                       <FormLabel>Post Anonymously</FormLabel>
//                       <FormDescription>Your name will not be displayed with your interview experience.</FormDescription>
//                     </div>
//                   </FormItem>
//                 )}
//               />
//             </div>
//           </CardContent>
//         </Card>

//         <div className="flex justify-end gap-4">
//           <Button type="button" variant="outline" onClick={() => router.back()}>
//             Cancel
//           </Button>
//           <Button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? "Submitting..." : "Submit Experience"}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   )
// }


// // "use client";

// // import * as React from "react";
// // import { useRouter } from "next/navigation";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { useForm } from "react-hook-form";
// // import { z } from "zod";
// // import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
// // import { toast } from "sonner";
// // import axios from "axios";

// // import { cn } from "@/lib/utils";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
// // import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// // import { Input } from "@/components/ui/input";
// // import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Badge } from "@/components/ui/badge";
// // import { useAuth } from "@/lib/auth-context";

// // const companies = [
// //   { label: "Google", value: "google" },
// //   { label: "Amazon", value: "amazon" },
// //   { label: "Microsoft", value: "microsoft" },
// //   { label: "Apple", value: "apple" },
// //   { label: "Meta", value: "meta" },
// //   { label: "Netflix", value: "netflix" },
// // ];

// // const tagsList = [
// //   "DSA",
// //   "System Design",
// //   "Behavioral",
// //   "SQL",
// //   "ML",
// //   "JavaScript",
// //   "React",
// //   "Java",
// //   "Python",
// // ];

// // const formSchema = z.object({
// //   company: z.string().min(1, "Please select a company"),
// //   otherCompany: z.string().optional(),
// //   role: z.string().min(1, "Please enter the job role"),
// //   level: z.string().min(1, "Please select an experience level"),
// //   questions: z.array(z.object({ question: z.string(), answer: z.string() })).min(1, "Please add at least one question"),
// //   experience: z.string().min(50, "Please provide a detailed experience (minimum 50 characters)"),
// //   tags: z.array(z.string()).min(1, "Please select at least one tag"),
// //   isAnonymous: z.boolean().default(false),
// // });



// // export function SubmitForm() {
// //   const router = useRouter();
// //   const { user } = useAuth();
// //   const [isSubmitting, setIsSubmitting] = React.useState(false);

// //   const form = useForm<z.infer<typeof formSchema>>({
// //     resolver: zodResolver(formSchema),
// //     defaultValues: {
// //       company: "",
// //       otherCompany: "",
// //       role: "",
// //       level: "",
// //       questions: [{ question: "", answer: "" }],
// //       experience: "",
// //       tags: [],
// //       isAnonymous: false,
// //     },
// //   });


"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getAuth } from "firebase/auth"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Minus, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
} from "@/components/ui/alert-dialog"

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
      answer: z.string().min(1, "Answer is required"),
    })
  ).min(1, "At least one question is required"),
  experience: z.string().min(10, "Please share your interview experience"),
  tips: z.string().optional(),
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
  const [formattedQuestions, setFormattedQuestions] = useState<any>([]);
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

      const payload = {
        ...data,
        authorId: user.uid,
        authorName: data.isAnonymous ? "Anonymous" : user.displayName || user.email,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/interviews`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        data.status === "published"
          ? "Your interview experience has been published!"
          : "Your interview has been saved as a draft"
      );

      router.push(
        data.status === "published"
          ? `/interviews/${response.data._id}`
          : "/profile/interviews"
      );
    } catch (error) {
      console.error("Error submitting interview:", error);
      toast.error("Failed to submit your interview. Please try again.");
    } finally {
      setIsSubmitting(false);
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
                  <Textarea
                    placeholder="Share your overall interview experience, process, and timeline..."
                    className="min-h-[150px]"
                    {...field}
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
                          <Textarea placeholder="What was your answer or solution?" {...field} />
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
                  <Textarea
                    placeholder="Any tips for others preparing for similar interviews?"
                    className="min-h-[100px]"
                    {...field}
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
