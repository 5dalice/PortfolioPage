"use client"

import Link from "next/link"
import { GoogleLogo } from "./google-logo"
import { SearchBar } from "./search-bar"

interface SearchHeaderProps {
  query: string
}

export function SearchHeader({ query }: SearchHeaderProps) {
  return (
    <header className="bg-[#f2f2f2] border-b border-[#dadce0]">
      <div className="flex items-center gap-6 px-6 py-3">
        <Link href="/" className="flex-shrink-0">
          <GoogleLogo size="small" />
        </Link>
        <div className="flex-1 max-w-[572px]">
          <SearchBar initialQuery={query} compact />
        </div>
      </div>

      {/* Navigation Tabs - classic style */}
      <nav className="flex gap-0 pl-[180px] border-t border-[#ebebeb]">
        <span className="px-3 py-2 text-[13px] text-[#1a0dab] border-b-2 border-[#1a0dab] bg-white">All</span>
        <span className="px-3 py-2 text-[13px] text-[#5f6368] hover:text-black cursor-pointer">Images</span>
        <span className="px-3 py-2 text-[13px] text-[#5f6368] hover:text-black cursor-pointer">Videos</span>
        <span className="px-3 py-2 text-[13px] text-[#5f6368] hover:text-black cursor-pointer">News</span>
        <span className="px-3 py-2 text-[13px] text-[#5f6368] hover:text-black cursor-pointer">More</span>
      </nav>
    </header>
  )
}
