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
      <div className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-6 md:px-6">
        <Link href="/" className="flex-shrink-0">
          <GoogleLogo size="small" />
        </Link>

        <div className="w-full md:max-w-[572px]">
          <SearchBar initialQuery={query} compact />
        </div>
      </div>

      <nav className="flex overflow-x-auto border-t border-[#ebebeb] px-4 md:pl-[180px] md:pr-6">
        <span className="shrink-0 px-3 py-2 text-[13px] text-[#1a0dab] border-b-2 border-[#1a0dab] bg-white">
          All
        </span>
        <span className="shrink-0 px-3 py-2 text-[13px] text-[#5f6368] hover:text-black cursor-pointer">
          Images
        </span>
        <span className="shrink-0 px-3 py-2 text-[13px] text-[#5f6368] hover:text-black cursor-pointer">
          Videos
        </span>
        <span className="shrink-0 px-3 py-2 text-[13px] text-[#5f6368] hover:text-black cursor-pointer">
          News
        </span>
        <span className="shrink-0 px-3 py-2 text-[13px] text-[#5f6368] hover:text-black cursor-pointer">
          More
        </span>
      </nav>
    </header>
  )
}