export function CompanyLogos() {
  const companies = [
    { name: "Google", logo: "G" },
    { name: "Amazon", logo: "A" },
    { name: "Microsoft", logo: "M" },
    { name: "Apple", logo: "A" },
    { name: "Meta", logo: "M" },
    { name: "Netflix", logo: "N" },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8 py-8">
      {companies.map((company) => (
        <div
          key={company.name}
          className="flex h-16 w-32 items-center justify-center rounded-md border bg-background p-4"
        >
          <span className="text-2xl font-bold">{company.logo}</span>
        </div>
      ))}
    </div>
  )
}

