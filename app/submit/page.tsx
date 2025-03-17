import SubmitInterview from "@/components/submit-form"

export default function SubmitPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Share Your Interview Experience</h1>
          <p className="text-muted-foreground">
            Help others prepare for their interviews by sharing your experience. Your insights could be invaluable to
            someone else's success.
          </p>
        </div>
        <SubmitInterview />
      </div>
    </div>
  )
}
