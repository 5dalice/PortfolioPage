import { Suspense } from "react"
import { SearchHeader } from "@/components/search-header"
import { SearchResult } from "@/components/search-result"
import { SearchFooter } from "@/components/search-footer"
import { searchPortfolio } from "@/lib/portfolio-data"

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

function SearchResults({ query }: { query: string }) {
  const results = searchPortfolio(query)

  if (results.length === 0) {
    return (
      <div className="py-8">
        <p className="text-[13px] text-[#545454]">
          Your search - <strong className="text-black">{query}</strong> - did not match any documents.
        </p>
        <p className="mt-4 text-[13px] text-[#545454]">Suggestions:</p>
        <ul className="mt-2 text-[13px] text-[#545454] list-disc ml-6">
          <li>Try searching for: about, projects, experience, experiments, writing, or contact</li>
          <li>Make sure all words are spelled correctly</li>
          <li>Try different keywords</li>
        </ul>
      </div>
    )
  }

  return (
    <div>
      <p className="text-[13px] text-[#70757a] mb-4">
        About {results.length} results (0.{Math.floor(Math.random() * 90) + 10} seconds)
      </p>

      {results.map((result) => (
        <SearchResult key={result.id} result={result} />
      ))}
    </div>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ""

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SearchHeader query={query} />

      <main className="flex-1 py-4 pl-[180px] pr-4">
        <Suspense fallback={<p className="text-[#545454]">Loading...</p>}>
          <SearchResults query={query} />
        </Suspense>
      </main>

      <SearchFooter query={query} />
    </div>
  )
}
