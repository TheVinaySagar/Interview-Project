"use client"

import { useState } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [wordCount, setWordCount] = useState(0)

  const handleChange = (content: string) => {
    onChange(content)
    setWordCount(content.replace(/<[^>]+>/g, "").trim().split(/\s+/).filter(Boolean).length)
  }

  return (
    <div className="border border-gray-300 rounded-md p-2 shadow-sm"> {/* Outer border */}
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        placeholder={placeholder || "Start writing your content here..."}
        className="custom-quill"
        aria-label="Rich text editor"
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
          ],
        }}
      />
      <div className="mt-2 text-sm text-gray-500">Word count: {wordCount}</div>
    </div>
  )
}
