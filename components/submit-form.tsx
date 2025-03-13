"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Check, ChevronsUpDown, Plus, X } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"

const companies = [
  { label: "Google", value: "google" },
  { label: "Amazon", value: "amazon" },
  { label: "Microsoft", value: "microsoft" },
  { label: "Apple", value: "apple" },
  { label: "Meta", value: "meta" },
  { label: "Netflix", value: "netflix" },
]

const tags = [
  { label: "DSA", value: "dsa" },
  { label: "System Design", value: "system-design" },
  { label: "Behavioral", value: "behavioral" },
  { label: "SQL", value: "sql" },
  { label: "ML", value: "ml" },
  { label: "JavaScript", value: "javascript" },
  { label: "React", value: "react" },
  { label: "Java", value: "java" },
  { label: "Python", value: "python" },
]

const formSchema = z.object({
  company: z.string().min(1, "Please select a company"),
  otherCompany: z.string().optional(),
  role: z.string().min(1, "Please enter the job role"),
  level: z.string().min(1, "Please select an experience level"),
  questions: z.array(
    z.object({
      question: z.string().min(1, "Question is required"),
      answer: z.string().min(1, "Answer is required")
    })
  ).min(1, "Please add at least one question"),
  experience: z.string().min(50, "Please provide a detailed experience (minimum 50 characters)"),
  tags: z.array(z.string()).min(1, "Please select at least one tag"),
  isAnonymous: z.boolean().default(false),
})

export function SubmitForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      otherCompany: "",
      role: "",
      level: "",
      questions: [{ question: "", answer: "" }],
      experience: "",
      tags: [],
      isAnonymous: false,
    },
  })

  const [openCompany, setOpenCompany] = React.useState(false)
  const [openTags, setOpenTags] = React.useState(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !user.token) {
      toast.error("You must be logged in to submit an interview experience")
      router.push("/login")
      return
    }

    try {
      setIsSubmitting(true)

      // Prepare the data
      const interviewData = {
        ...values,
        company:
          values.company === "other" ? values.otherCompany : companies.find((c) => c.value === values.company)?.label,
      }

      // Submit to API
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/interviews`, interviewData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      toast.success("Interview experience submitted successfully!")
      router.push("/interviews")
    } catch (error: any) {
      console.error("Error submitting interview:", error)
      toast.error(error.response?.data?.message || "Failed to submit interview experience")
    } finally {
      setIsSubmitting(false)
    }
  }

  const watchCompany = form.watch("company")
  const watchTags = form.watch("tags")
  const watchQuestions = form.watch("questions")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Company</FormLabel>
                      <Popover open={openCompany} onOpenChange={setOpenCompany}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openCompany}
                              className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                            >
                              {field.value
                                ? companies.find((company) => company.value === field.value)?.label || "Other"
                                : "Select company..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search company..." />
                            <CommandList>
                              <CommandEmpty>No company found.</CommandEmpty>
                              <CommandGroup>
                                {companies.map((company) => (
                                  <CommandItem
                                    key={company.value}
                                    value={company.value}
                                    onSelect={(value) => {
                                      form.setValue("company", value)
                                      setOpenCompany(false)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        company.value === field.value ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                    {company.label}
                                  </CommandItem>
                                ))}
                                <CommandItem
                                  value="other"
                                  onSelect={() => {
                                    form.setValue("company", "other")
                                    setOpenCompany(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      "other" === field.value ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  Other
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchCompany === "other" && (
                  <FormField
                    control={form.control}
                    name="otherCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Software Engineer, Data Scientist" {...field} />
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
                      <FormLabel>Experience Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="fresher">Fresher</SelectItem>
                          <SelectItem value="experienced">Experienced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="questions"
                render={() => (
                  <FormItem>
                    <FormLabel>Interview Questions</FormLabel>
                    <FormDescription>Add the questions and their answers.</FormDescription>

                    <div className="space-y-4">
                      {watchQuestions.map((item, index) => (
                        <div key={index} className="space-y-2 border p-3 rounded-md">
                          <Input
                            placeholder={`Question ${index + 1}`}
                            value={item.question}
                            onChange={(e) => {
                              const newQuestions = [...watchQuestions];
                              newQuestions[index] = {
                                ...newQuestions[index],
                                question: e.target.value
                              };
                              form.setValue("questions", newQuestions);
                            }}
                          />
                          <Textarea
                            placeholder="Your answer..."
                            value={item.answer}
                            onChange={(e) => {
                              const newQuestions = [...watchQuestions];
                              newQuestions[index] = {
                                ...newQuestions[index],
                                answer: e.target.value
                              };
                              form.setValue("questions", newQuestions);
                            }}
                          />
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newQuestions = watchQuestions.filter((_, i) => i !== index);
                                form.setValue("questions", newQuestions);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          const questions = watchQuestions;
                          form.setValue("questions", [...questions, { question: "", answer: "" }]);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Question
                      </Button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Experience</FormLabel>
                    <FormDescription>
                      Describe your interview experience in detail. Include the interview process, types of questions
                      asked, and any advice for future candidates.
                    </FormDescription>
                    <FormControl>
                      <Textarea placeholder="Share your interview experience..." className="min-h-[200px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormDescription>Select tags that best describe your interview experience.</FormDescription>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {watchTags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tags.find((t) => t.value === tag)?.label}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-1"
                            onClick={() => {
                              form.setValue(
                                "tags",
                                watchTags.filter((t) => t !== tag),
                              )
                            }}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <Popover open={openTags} onOpenChange={setOpenTags}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openTags}
                            className="w-full justify-between"
                          >
                            Select tags...
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search tags..." />
                          <CommandList>
                            <CommandEmpty>No tag found.</CommandEmpty>
                            <CommandGroup>
                              {tags.map((tag) => (
                                <CommandItem
                                  key={tag.value}
                                  value={tag.value}
                                  onSelect={(value) => {
                                    form.setValue(
                                      "tags",
                                      watchTags.includes(value)
                                        ? watchTags.filter((t) => t !== value)
                                        : [...watchTags, value],
                                    )
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      watchTags.includes(tag.value) ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  {tag.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Post Anonymously</FormLabel>
                      <FormDescription>Your name will not be displayed with your interview experience.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Experience"}
          </Button>
        </div>
      </form>
    </Form>
  )
}


// "use client";

// import * as React from "react";
// import { useRouter } from "next/navigation";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
// import { toast } from "sonner";
// import axios from "axios";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { useAuth } from "@/lib/auth-context";

// const companies = [
//   { label: "Google", value: "google" },
//   { label: "Amazon", value: "amazon" },
//   { label: "Microsoft", value: "microsoft" },
//   { label: "Apple", value: "apple" },
//   { label: "Meta", value: "meta" },
//   { label: "Netflix", value: "netflix" },
// ];

// const tagsList = [
//   "DSA",
//   "System Design",
//   "Behavioral",
//   "SQL",
//   "ML",
//   "JavaScript",
//   "React",
//   "Java",
//   "Python",
// ];

// const formSchema = z.object({
//   company: z.string().min(1, "Please select a company"),
//   otherCompany: z.string().optional(),
//   role: z.string().min(1, "Please enter the job role"),
//   level: z.string().min(1, "Please select an experience level"),
//   questions: z.array(z.object({ question: z.string(), answer: z.string() })).min(1, "Please add at least one question"),
//   experience: z.string().min(50, "Please provide a detailed experience (minimum 50 characters)"),
//   tags: z.array(z.string()).min(1, "Please select at least one tag"),
//   isAnonymous: z.boolean().default(false),
// });



// export function SubmitForm() {
//   const router = useRouter();
//   const { user } = useAuth();
//   const [isSubmitting, setIsSubmitting] = React.useState(false);

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
//   });
