// "use client"

// import * as React from "react"
// import { useRouter } from "next/navigation"
// import { Building2, GraduationCap, Search, Loader2 } from "lucide-react"
// import {
//   Command,
//   CommandDialog,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command"
// import { Input } from "@/components/ui/input"
// import { cn } from "@/lib/utils"
// import axios from "axios"
// import { useDebounce } from "@/hooks/use-debounce"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"

// type SearchResult = {
//   companies: Array<{
//     name: string
//     count: number
//     recentRoles: string[]
//   }>
//   roles: Array<{
//     title: string
//     count: number
//     companies: string[]
//   }>
// }

// interface SearchBoxProps {
//   className?: string;
// }

// export function SearchBox({ className }: SearchBoxProps) {
//   const router = useRouter()
//   const [open, setOpen] = React.useState(false)
//   const [query, setQuery] = React.useState("")
//   const [results, setResults] = React.useState<SearchResult>({
//     companies: [],
//     roles: []
//   })
//   const [loading, setLoading] = React.useState(false)

//   // Cache for storing all results for instant filtering
//   const [resultsCache, setResultsCache] = React.useState<{
//     companies: Array<{ name: string, count: number, recentRoles: string[] }>
//     roles: Array<{ title: string, count: number, companies: string[] }>
//   }>({
//     companies: [],
//     roles: []
//   })

//   // Use a very short debounce for API calls
//   const debouncedQuery = useDebounce(query, 500)

//   // Ref to store the abort controller for cancelling previous requests
//   const abortControllerRef = React.useRef<AbortController | null>(null)

//   // Get real-time suggestions from cache while API is loading
//   const getInstantResults = React.useCallback((input: string): SearchResult => {
//     if (!input || input.length < 2) return { companies: [], roles: [] }

//     const lowercaseInput = input.toLowerCase()

//     // Filter companies that match the input
//     const filteredCompanies = resultsCache.companies
//       .filter(company => company.name.toLowerCase().includes(lowercaseInput))
//       .sort((a, b) => {
//         // Prioritize exact matches and matches at beginning
//         const aStarts = a.name.toLowerCase().startsWith(lowercaseInput)
//         const bStarts = b.name.toLowerCase().startsWith(lowercaseInput)
//         if (aStarts && !bStarts) return -1
//         if (!aStarts && bStarts) return 1
//         return b.count - a.count
//       })
//       .slice(0, 5)

//     // Filter roles that match the input
//     const filteredRoles = resultsCache.roles
//       .filter(role => role.title.toLowerCase().includes(lowercaseInput))
//       .sort((a, b) => {
//         // Prioritize exact matches and matches at beginning
//         const aStarts = a.title.toLowerCase().startsWith(lowercaseInput)
//         const bStarts = b.title.toLowerCase().startsWith(lowercaseInput)
//         if (aStarts && !bStarts) return -1
//         if (!aStarts && bStarts) return 1
//         return b.count - a.count
//       })
//       .slice(0, 5)

//     return { companies: filteredCompanies, roles: filteredRoles }
//   }, [resultsCache])

//   // The display results combine API results with real-time filtered results
//   const displayResults = React.useMemo(() => {
//     if (query.length < 2) return { companies: [], roles: [] }

//     if (loading) {
//       // Show instant results from cache while loading
//       return getInstantResults(query)
//     }

//     return results
//   }, [query, results, loading, getInstantResults])

//   const handleSearch = (value: string) => {
//     setQuery(value)

//     // Show instant results while typing, even before debounce triggers
//     if (value.length >= 2 && resultsCache.companies.length > 0) {
//       const instantResults = getInstantResults(value)
//       if (instantResults.companies.length > 0 || instantResults.roles.length > 0) {
//         // Only show loading indicator for new searches if we don't have instant results
//         setLoading(true)
//       }
//     }
//   }

//   // Initial data fetch for popular terms to use in instant search
//   React.useEffect(() => {
//     const prefetchCommonTerms = async () => {
//       try {
//         const { data } = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/interviews/search`,
//           {
//             params: {
//               query: "",
//               limit: 100 // Get popular results for instant filtering
//             }
//           }
//         )
//         setResultsCache(data)
//       } catch (error) {
//         console.error('Failed to prefetch common terms:', error)
//       }
//     }

//     prefetchCommonTerms()
//   }, [])

//   // Fetch results from API when debounced query changes
//   React.useEffect(() => {
//     const fetchResults = async () => {
//       if (!debouncedQuery || debouncedQuery.length < 2) {
//         setResults({ companies: [], roles: [] })
//         setLoading(false)
//         return
//       }

//       setLoading(true)

//       // Cancel previous request if exists
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort()
//       }

//       // Create new abort controller
//       const abortController = new AbortController()
//       abortControllerRef.current = abortController

//       try {
//         const { data } = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/interviews/search`,
//           {
//             params: {
//               query: debouncedQuery,
//               limit: 10
//             },
//             signal: abortController.signal
//           }
//         )
//         setResults(data)

//         // Update cache with new results for future instant searches
//         setResultsCache(prev => {
//           const newCompanies = [...prev.companies]
//           const newRoles = [...prev.roles]

//           // Add new companies to cache
//           data.companies.forEach((company: any) => {
//             if (!newCompanies.some(c => c.name === company.name)) {
//               newCompanies.push(company)
//             }
//           })

//           // Add new roles to cache
//           data.roles.forEach((role: any) => {
//             if (!newRoles.some(r => r.title === role.title)) {
//               newRoles.push(role)
//             }
//           })

//           return {
//             companies: newCompanies,
//             roles: newRoles
//           }
//         })
//       } catch (error) {
//         if (axios.isCancel(error)) {
//           console.log('Request cancelled')
//         } else {
//           console.error('Search error:', error)
//           setResults({ companies: [], roles: [] })
//         }
//       } finally {
//         if (abortControllerRef.current === abortController) {
//           setLoading(false)
//         }
//       }
//     }

//     fetchResults()
//   }, [debouncedQuery])

//   React.useEffect(() => {
//     const down = (e: KeyboardEvent) => {
//       if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault()
//         setOpen((open) => !open)
//       }
//     }
//     document.addEventListener("keydown", down)
//     return () => document.removeEventListener("keydown", down)
//   }, [])

//   const handleSelect = (value: string, type: 'company' | 'role') => {
//     setOpen(false)
//     router.push(`/interviews?${type}=${encodeURIComponent(value)}`)
//   }

//   return (
//     <>
//       <div className="w-full max-w-lg space-y-2">
//         <div
//           onClick={() => setOpen(true)}
//           className="relative group cursor-text"
//           role="button"
//           aria-haspopup="dialog"
//           aria-expanded={open}
//           aria-label="Search interviews"
//         >
//           {loading ? (
//             <Loader2 className="absolute left-3 top-3 h-4 w-4 text-primary animate-spin" />
//           ) : (
//             <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//           )}
//           <Input
//             className="w-full h-12 bg-background pl-10 pr-12 rounded-xl border-2 border-input text-base focus-visible:ring-1 focus-visible:ring-primary"
//             placeholder="Search companies or roles (e.g. 'Google' or 'Frontend')"
//             value={query}
//             onChange={(e) => handleSearch(e.target.value)}
//             onClick={() => setOpen(true)}
//             aria-label="Search input"
//           />
//           <kbd className="pointer-events-none absolute right-3 top-3 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium opacity-100 group-hover:opacity-100 sm:flex">
//             <span className="text-xs">⌘</span>K
//           </kbd>
//         </div>
//       </div>
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="p-0 max-w-2xl">
//           <DialogHeader className="sr-only">
//             <DialogTitle>Search Interviews</DialogTitle>
//             <DialogDescription>
//               Search for companies and roles in interview experiences
//             </DialogDescription>
//           </DialogHeader>
//           <Command className="rounded-lg border shadow-md">
//             <CommandInput
//               placeholder="Search companies or roles..."
//               value={query}
//               onValueChange={handleSearch}
//               autoFocus
//             />
//             <CommandList>
//               <CommandEmpty>
//                 {query.length < 2 ? (
//                   <p className="p-4 text-sm text-muted-foreground">
//                     Type at least 2 characters to search...
//                   </p>
//                 ) : loading && displayResults.companies.length === 0 && displayResults.roles.length === 0 ? (
//                   <div className="flex items-center justify-center py-6" role="status">
//                     <div
//                       className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2"
//                       aria-label="Loading results"
//                     />
//                     <p className="text-sm text-muted-foreground">Searching...</p>
//                   </div>
//                 ) : (
//                   <p className="p-4 text-sm text-muted-foreground">
//                     No results found. Try a different search term.
//                   </p>
//                 )}
//               </CommandEmpty>
//               {displayResults.companies.length > 0 && (
//                 <CommandGroup heading={loading ? "Suggested Companies" : "Companies"}>
//                   {displayResults.companies.map((company) => (
//                     <CommandItem
//                       key={company.name}
//                       onSelect={() => handleSelect(company.name, 'company')}
//                       className="px-4 py-2"
//                     >
//                       <div className="flex items-start gap-2">
//                         <Building2 className="h-4 w-4 text-muted-foreground mt-1" />
//                         <div className="flex flex-col">
//                           <span className="font-medium">
//                             {query.length >= 2 ? (
//                               highlightMatch(company.name, query)
//                             ) : (
//                               company.name
//                             )}
//                           </span>
//                           <span className="text-xs text-muted-foreground">
//                             {company.count} interviews • Recent roles: {company.recentRoles.join(', ')}
//                           </span>
//                         </div>
//                       </div>
//                     </CommandItem>
//                   ))}
//                 </CommandGroup>
//               )}
//               {displayResults.roles.length > 0 && (
//                 <CommandGroup heading={loading ? "Suggested Roles" : "Roles"}>
//                   {displayResults.roles.map((role) => (
//                     <CommandItem
//                       key={role.title}
//                       onSelect={() => handleSelect(role.title, 'role')}
//                       className="px-4 py-2"
//                     >
//                       <div className="flex items-start gap-2">
//                         <GraduationCap className="h-4 w-4 text-muted-foreground mt-1" />
//                         <div className="flex flex-col">
//                           <span className="font-medium">
//                             {query.length >= 2 ? (
//                               highlightMatch(role.title, query)
//                             ) : (
//                               role.title
//                             )}
//                           </span>
//                           <span className="text-xs text-muted-foreground">
//                             {role.count} interviews • Top companies: {role.companies.slice(0, 3).join(', ')}
//                           </span>
//                         </div>
//                       </div>
//                     </CommandItem>
//                   ))}
//                 </CommandGroup>
//               )}
//               {loading && query.length >= 2 &&
//                 displayResults.companies.length === 0 &&
//                 displayResults.roles.length === 0 && (
//                   <div className="p-4 flex justify-center">
//                     <span className="text-sm text-muted-foreground">
//                       Searching...
//                     </span>
//                   </div>
//                 )}
//             </CommandList>
//           </Command>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }

// // Helper function to highlight the matching part of text
// function highlightMatch(text: string, query: string) {
//   if (!query || query.length < 2) return text

//   const lowerText = text.toLowerCase()
//   const lowerQuery = query.toLowerCase()
//   const index = lowerText.indexOf(lowerQuery)

//   if (index === -1) return text

//   return (
//     <>
//       {text.substring(0, index)}
//       <span className="bg-yellow-100 text-yellow-900 rounded px-0.5">
//         {text.substring(index, index + query.length)}
//       </span>
//       {text.substring(index + query.length)}
//     </>
//   )
// }

// "use client"

// import * as React from "react"
// import { useRouter } from "next/navigation"
// import { Building2, GraduationCap, Search, Loader2, X } from "lucide-react"
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command"
// import { Input } from "@/components/ui/input"
// import { cn } from "@/lib/utils"
// import axios from "axios"

// type SearchResult = {
//   companies: Array<{
//     name: string
//     count: number
//     recentRoles: string[]
//   }>
//   roles: Array<{
//     title: string
//     count: number
//     companies: string[]
//   }>
// }

// interface SearchBoxProps {
//   className?: string;
// }

// export function SearchBox({ className }: SearchBoxProps) {
//   const router = useRouter()
//   const [query, setQuery] = React.useState("")
//   const [results, setResults] = React.useState<SearchResult>({
//     companies: [],
//     roles: []
//   })
//   const [loading, setLoading] = React.useState(false)
//   const [showResults, setShowResults] = React.useState(false)
//   const [hasSearched, setHasSearched] = React.useState(false)

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       e.preventDefault()
//       fetchResults()
//     }
//   }

//   const fetchResults = async () => {
//     if (!query || query.length < 2) {
//       setResults({ companies: [], roles: [] })
//       setLoading(false)
//       return
//     }

//     setLoading(true)
//     setHasSearched(true)
//     setShowResults(true)

//     try {
//       const { data } = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/interviews/search`,
//         {
//           params: {
//             query: query,
//             limit: 10
//           }
//         }
//       )
//       setResults(data)
//     } catch (error) {
//       console.error('Search error:', error)
//       setResults({ companies: [], roles: [] })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSelect = (value: string, type: 'company' | 'role') => {
//     setShowResults(false)
//     router.push(`/interviews?${type}=${encodeURIComponent(value)}`)
//   }

//   const clearSearch = () => {
//     setQuery("")
//     setResults({ companies: [], roles: [] })
//     setShowResults(false)
//     setHasSearched(false)
//   }

//   return (
//     <div className={cn("relative w-full max-w-lg", className)}>
//       <div className="relative group">
//         {loading ? (
//           <Loader2 className="absolute left-3 top-3 h-4 w-4 text-primary animate-spin" />
//         ) : (
//           <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//         )}
//         <Input
//           className="w-full h-12 bg-background pl-10 pr-12 rounded-xl border-2 border-input text-base focus-visible:ring-1 focus-visible:ring-primary"
//           placeholder="Search companies or roles (e.g. 'Google' or 'Frontend')"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyDown={handleKeyDown}
//           onFocus={() => hasSearched && setShowResults(true)}
//           aria-label="Search input"
//         />
//         {query && (
//           <button
//             onClick={clearSearch}
//             className="absolute right-3 top-3 text-muted-foreground"
//             aria-label="Clear search"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         )}
//       </div>

//       {showResults && (
//         <Command className="absolute top-14 z-10 w-full rounded-lg border bg-popover shadow-lg">
//           <CommandList>
//             <CommandEmpty>
//               {!hasSearched ? (
//                 <p className="p-4 text-sm text-muted-foreground">
//                   Type your search and press Enter to see results
//                 </p>
//               ) : loading ? (
//                 <div className="flex items-center justify-center py-6" role="status">
//                   <div
//                     className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2"
//                     aria-label="Loading results"
//                   />
//                   <p className="text-sm text-muted-foreground">Searching...</p>
//                 </div>
//               ) : (
//                 <p className="p-4 text-sm text-muted-foreground">
//                   No results found. Try a different search term.
//                 </p>
//               )}
//             </CommandEmpty>
//             {results.companies.length > 0 && (
//               <CommandGroup heading="Companies">
//                 {results.companies.map((company) => (
//                   <CommandItem
//                     key={company.name}
//                     onSelect={() => handleSelect(company.name, 'company')}
//                     className="px-4 py-2 cursor-pointer"
//                   >
//                     <div className="flex items-start gap-2">
//                       <Building2 className="h-4 w-4 text-muted-foreground mt-1" />
//                       <div className="flex flex-col">
//                         <span className="font-medium">
//                           {highlightMatch(company.name, query)}
//                         </span>
//                         <span className="text-xs text-muted-foreground">
//                           {company.count} interviews • Recent roles: {company.recentRoles.join(', ')}
//                         </span>
//                       </div>
//                     </div>
//                   </CommandItem>
//                 ))}
//               </CommandGroup>
//             )}
//             {results.roles.length > 0 && (
//               <CommandGroup heading="Roles">
//                 {results.roles.map((role) => (
//                   <CommandItem
//                     key={role.title}
//                     onSelect={() => handleSelect(role.title, 'role')}
//                     className="px-4 py-2 cursor-pointer"
//                   >
//                     <div className="flex items-start gap-2">
//                       <GraduationCap className="h-4 w-4 text-muted-foreground mt-1" />
//                       <div className="flex flex-col">
//                         <span className="font-medium">
//                           {highlightMatch(role.title, query)}
//                         </span>
//                         <span className="text-xs text-muted-foreground">
//                           {role.count} interviews • Top companies: {role.companies.slice(0, 3).join(', ')}
//                         </span>
//                       </div>
//                     </div>
//                   </CommandItem>
//                 ))}
//               </CommandGroup>
//             )}
//           </CommandList>
//         </Command>
//       )}
//     </div>
//   )
// }

// function highlightMatch(text: string, query: string) {
//   if (!query || query.length < 2) return text

//   const lowerText = text.toLowerCase()
//   const lowerQuery = query.toLowerCase()
//   const index = lowerText.indexOf(lowerQuery)

//   if (index === -1) return text

//   return (
//     <>
//       {text.substring(0, index)}
//       <span className="bg-yellow-100 text-yellow-900 rounded px-0.5">
//         {text.substring(index, index + query.length)}
//       </span>
//       {text.substring(index + query.length)}
//     </>
//   )
// }


"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Building2, GraduationCap, Search, Loader2, X } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import axios from "axios"

type SearchResult = {
  companies: Array<{
    name: string
    count: number
    recentRoles: string[]
  }>
  roles: Array<{
    title: string
    count: number
    companies: string[]
  }>
}

interface SearchBoxProps {
  className?: string;
}

export function SearchBox({ className }: SearchBoxProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult>({
    companies: [],
    roles: []
  })
  const [loading, setLoading] = React.useState(false)
  const [showResults, setShowResults] = React.useState(false)
  const [hasSearched, setHasSearched] = React.useState(false)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      fetchResults()
    }
  }

  const fetchResults = async () => {
    if (!query || query.length < 2) {
      setResults({ companies: [], roles: [] })
      setLoading(false)
      return
    }

    setLoading(true)
    setHasSearched(true)
    setShowResults(true)

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/interviews/search`,
        {
          params: {
            query: query,
            limit: 10
          }
        }
      )
      setResults(data)
    } catch (error) {
      console.error('Search error:', error)
      setResults({ companies: [], roles: [] })
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (value: string, type: 'company' | 'role') => {
    setShowResults(false)
    router.push(`/interviews?${type}=${encodeURIComponent(value)}`)
  }

  const clearSearch = () => {
    setQuery("")
    setResults({ companies: [], roles: [] })
    setShowResults(false)
    setHasSearched(false)
  }

  return (
    <div className={cn("relative w-full max-w-lg", className)}>
      <div className="relative group">
        {loading ? (
          <Loader2 className="absolute left-3 top-3 h-4 w-4 text-primary animate-spin" />
        ) : (
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          className="w-full h-12 bg-background pl-10 pr-12 rounded-xl border-2 border-input text-base focus-visible:ring-1 focus-visible:ring-primary"
          placeholder="Search companies or roles"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => hasSearched && setShowResults(true)}
          aria-label="Search input"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute top-14 z-50 w-full rounded-lg border bg-popover shadow-lg overflow-hidden">
          <Command>
            <CommandList className="max-h-[400px] overflow-y-auto">
              <CommandEmpty>
                {!hasSearched ? (
                  <div className="p-4 text-sm text-muted-foreground flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    <span>Type your search and press Enter</span>
                  </div>
                ) : loading ? (
                  <div className="flex items-center justify-center py-6" role="status">
                    <div
                      className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2"
                      aria-label="Loading results"
                    />
                    <p className="text-sm text-muted-foreground">Searching...</p>
                  </div>
                ) : (
                  <div className="p-4 text-sm text-muted-foreground flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    <span>No results found. Try a different search term.</span>
                  </div>
                )}
              </CommandEmpty>

              {results.companies.length > 0 && (
                <CommandGroup heading="Companies" className="px-2 py-1">
                  {results.companies.map((company) => (
                    <CommandItem
                      key={company.name}
                      onSelect={() => handleSelect(company.name, 'company')}
                      className="px-3 py-2 cursor-pointer rounded-md hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Building2 className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {highlightMatch(company.name, query)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {company.count} interviews • Recent roles: {company.recentRoles.join(', ')}
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results.roles.length > 0 && (
                <CommandGroup heading="Roles" className="px-2 py-1">
                  {results.roles.map((role) => (
                    <CommandItem
                      key={role.title}
                      onSelect={() => handleSelect(role.title, 'role')}
                      className="px-3 py-2 cursor-pointer rounded-md hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {highlightMatch(role.title, query)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {role.count} interviews • Top companies: {role.companies.slice(0, 3).join(', ')}
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}

function highlightMatch(text: string, query: string) {
  if (!query || query.length < 2) return text

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)

  if (index === -1) return text

  return (
    <>
      {text.substring(0, index)}
      <span className="bg-yellow-100 text-yellow-900 rounded px-0.5">
        {text.substring(index, index + query.length)}
      </span>
      {text.substring(index + query.length)}
    </>
  )
}
