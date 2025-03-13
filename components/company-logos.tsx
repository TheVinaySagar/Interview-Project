import Image from "next/image";

export function CompanyLogos() {
  const companies = [
    { name: "Google", logo: "/logos/google.png" },
    { name: "Amazon", logo: "/logos/amazon.png" },
    { name: "Microsoft", logo: "/logos/microsoft.png" },
    { name: "Apple", logo: "/logos/apple.png" },
    { name: "Meta", logo: "/logos/meta.png" },
    { name: "Netflix", logo: "/logos/netflix.png" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-10 py-8">
      {companies.map((company) => (
        <div
          key={company.name}
          className="flex h-24 w-40 items-center justify-center rounded-lg border bg-background p-4 shadow-md"
        >
          <div className="relative w-[100px] h-[50px] md:w-[120px] md:h-[60px]">
            <Image
              src={company.logo}
              alt={`${company.name} Logo`}
              layout="fill" // ✅ Ensures image fills container
              objectFit="contain" // ✅ Avoids stretching
              className="max-w-full max-h-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
