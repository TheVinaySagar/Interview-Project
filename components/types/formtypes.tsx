import { z } from "zod";

export const formSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Job role is required"),
  level: z.enum(["internship", "fresher", "experienced"], {
    required_error: "Please select a level",
  }),
  questions: z
    .array(
      z.object({
        question: z
          .string()
          .min(1, "Question is required")
          .optional()
          .or(z.literal("")),
        answer: z
          .string()
          .optional()
          .or(z.literal(""))
          .refine(
            (val) => !val || val.replace(/<[^>]+>/g, "").trim().length >= 10,
            "Please provide a substantial answer"
          ),
      })
    )
    .optional(),
  experience: z
    .string()
    .refine(
      (val) => val.replace(/<[^>]+>/g, "").trim().length >= 10,
      "Please share at least 10 characters of meaningful content"
    ),
  tips: z
    .string()
    .optional()
    .transform((val) => val || ""),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  isAnonymous: z.boolean().default(false),
  status: z.enum(["draft", "published", "pending"], {
    required_error: "Please select a status",
  }),
});