"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

const companies = [
  { label: "Google", value: "google" },
  { label: "Amazon", value: "amazon" },
  { label: "Microsoft", value: "microsoft" },
  { label: "Apple", value: "apple" },
  { label: "Meta", value: "meta" },
  { label: "Netflix", value: "netflix" },
]

const roles = [
  { label: "Software Engineer", value: "swe" },
  { label: "Data Scientist", value: "ds" },
  { label: "Product Manager", value: "pm" },
  { label: "UX Designer", value: "ux" },
  { label: "DevOps Engineer", value: "devops" },
]

const levels = [
  { label: "Internship", value: "internship" },
  { label: "Fresher", value: "fresher" },
  { label: "Experienced", value: "experienced" },
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


import { useState, useEffect } from "react";



export function InterviewFilters() {
  const router = useRouter();
  const [openCompany, setOpenCompany] = useState(false);
  const [company, setCompany] = useState("");
  const [openRole, setOpenRole] = useState(false);
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const applyFilters = () => {
    const queryParams = new URLSearchParams();

    if (company.trim()) queryParams.append("company", company);
    if (role.trim()) queryParams.append("role", role);
    if (level.trim()) queryParams.append("level", level);
    if (selectedTags.length > 0) queryParams.append("tags", selectedTags.join(","));

    router.push(`/interviews?${queryParams.toString()}`, { scroll: false }); // ✅ URL Update
  };


  const resetFilters = () => {
    setCompany("");
    setRole("");
    setLevel("");
    setSelectedTags([]);

    // ✅ URL se filters hatao
    router.push("/interviews", { scroll: false });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Filters</h3>
        <Separator />
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Company</h4>
        <Popover open={openCompany} onOpenChange={setOpenCompany}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={openCompany} className="w-full justify-between">
              {company ? companies.find((c) => c.value === company)?.label : "Select company..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search company..." />
              <CommandList>
                <CommandEmpty>No company found.</CommandEmpty>
                <CommandGroup>
                  {companies.map((c) => (
                    <CommandItem
                      key={c.value}
                      value={c.value}
                      onSelect={(currentValue) => {
                        setCompany(currentValue === company ? "" : currentValue)
                        setOpenCompany(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", company === c.value ? "opacity-100" : "opacity-0")} />
                      {c.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Role</h4>
        <Popover open={openRole} onOpenChange={setOpenRole}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={openRole} className="w-full justify-between">
              {role ? roles.find((r) => r.value === role)?.label : "Select role..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search role..." />
              <CommandList>
                <CommandEmpty>No role found.</CommandEmpty>
                <CommandGroup>
                  {roles.map((r) => (
                    <CommandItem
                      key={r.value}
                      value={r.value}
                      onSelect={(currentValue) => {
                        setRole(currentValue === role ? "" : currentValue)
                        setOpenRole(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", role === r.value ? "opacity-100" : "opacity-0")} />
                      {r.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Experience Level</h4>
        <RadioGroup value={level} onValueChange={setLevel}>
          {levels.map((l) => (
            <div key={l.value} className="flex items-center space-x-2">
              <RadioGroupItem value={l.value} id={l.value} />
              <Label htmlFor={l.value}>{l.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Tags</h4>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="tags">
            <AccordionTrigger className="text-sm">Select Tags</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {tags.map((tag) => (
                  <div key={tag.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag.value}
                      checked={selectedTags.includes(tag.value)}
                      onCheckedChange={() => handleTagChange(tag.value)}
                    />
                    <Label htmlFor={tag.value}>{tag.label}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <Button className="w-full" onClick={applyFilters}>Apply Filters</Button>
      <Button variant="outline" className="w-full" onClick={resetFilters}>
        Reset
      </Button>
    </div>
  )
}
