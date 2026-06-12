"use client"

import { useRouter } from "next/navigation"

interface SearchFooterProps {
  query: string
}

export function SearchFooter({ query }: SearchFooterProps) {
  const router = useRouter()

  const relatedSearches = [
    "about",
    "projects",
    "experience",
      "writings",
    "contact",
  ].filter((term) => term !== query.toLowerCase())

  return (
    <footer className="mt-auto">
      {/* Gooooogle Pagination */}
      <div className="flex items-center justify-center px-4 py-4">
        <span
          style={{
            fontFamily: "'Times New Roman', serif",
            fontSize: "28px",
          }}
        >
          <span style={{ color: "#4285f4" }}>A</span>
          <span style={{ color: "#ea4335" }}>l</span>
          <span style={{ color: "#fbbc05" }}>i</span>
          <span style={{ color: "#4285f4" }}>i</span>
          <span style={{ color: "#34a853" }}>i</span>
          <span style={{ color: "#ea4335" }}>i</span>
          <span style={{ color: "#4285f4" }}>i</span>
          <span style={{ color: "#ea4335" }}>c</span>
          <span style={{ color: "#4285f4" }}>e</span>
        </span>
      </div>

      {/* Page Numbers */}
      <div className="flex items-center justify-center gap-3 overflow-x-auto px-4 pb-4 text-[13px] sm:gap-4">
        <span className="shrink-0 text-[#d93025] font-bold">1</span>
        <span className="shrink-0 text-[#1a0dab] hover:underline cursor-pointer">
          2
        </span>
        <span className="shrink-0 text-[#1a0dab] hover:underline cursor-pointer">
          3
        </span>
        <span className="shrink-0 text-[#1a0dab] hover:underline cursor-pointer">
          4
        </span>
        <span className="shrink-0 text-[#1a0dab] hover:underline cursor-pointer">
          5
        </span>
        <span className="shrink-0 text-[#1a0dab] hover:underline cursor-pointer">
          Next &gt;
        </span>
      </div>

      {/* Related Searches */}
      <div className="border-t border-[#ebebeb] px-4 py-4 md:pl-[180px] md:pr-6">
        <p className="mb-3 text-[13px] text-[#70757a]">
          Searches related to "{query}"
        </p>

        <div className="grid max-w-[500px] grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-8">
          {relatedSearches.slice(0, 6).map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => router.push(`/search?q=${term}`)}
              className="flex items-center gap-2 text-left text-[13px] text-[#1a0dab] hover:underline"
            >
              <svg
                className="h-4 w-4 shrink-0 text-[#9aa0a6]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>{term} alice ewaldsen</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer - full width */}
      <div className="border-t border-[#dadce0] bg-[#f2f2f2] px-4 py-3 sm:px-6">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-[#70757a]">
          <span className="hover:underline cursor-pointer">Help</span>
          <span className="hover:underline cursor-pointer">Send feedback</span>
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span className="hover:underline cursor-pointer">Terms</span>
        </div>
      </div>
    </footer>
  )
}