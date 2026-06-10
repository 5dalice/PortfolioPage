"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { searchSuggestions } from "@/lib/portfolio-data"

interface SearchBarProps {
  initialQuery?: string
  autoFocus?: boolean
  compact?: boolean
}

export function SearchBar({ initialQuery = "", autoFocus = false, compact = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const filteredSuggestions = searchSuggestions
    .filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()) && query.length > 0)
    .slice(0, 8)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim()
    if (trimmed) {
      setShowSuggestions(false)
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (selectedIndex >= 0) {
        handleSearch(filteredSuggestions[selectedIndex])
      } else {
        handleSearch(query)
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedIndex(-1)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          className={`w-full bg-white text-black
            border-2 border-[#c0c0c0] 
            focus:outline-none focus:border-[#4285f4]
            ${compact ? "px-3 py-2 text-[14px]" : "px-4 py-3 text-[16px]"}`}
          style={{
            boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.1)",
          }}
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border-2 border-[#c0c0c0] border-t-0 z-50">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSearch(suggestion)}
                className={`w-full text-left px-4 py-2 text-[14px] flex items-center gap-2
                  ${index === selectedIndex ? "bg-[#eee]" : "hover:bg-[#eee]"}`}
              >
                <svg className="w-4 h-4 text-[#9aa0a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-black">{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {!compact && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="submit"
            className="px-4 py-1.5 text-[13px] text-black
              bg-[#f2f2f2] border border-[#f2f2f2]
              hover:border-[#c6c6c6] hover:shadow-sm
              active:border-[#666]"
            style={{
              background: "linear-gradient(to bottom, #f5f5f5 0%, #f1f1f1 100%)",
            }}
          >
            Alice Search
          </button>
        <button
  type="button"
  onClick={() => handleSearch("contact")}
  className="px-4 py-1.5 text-[13px] text-black
    bg-[#f2f2f2] border border-[#f2f2f2]
    hover:border-[#c6c6c6] hover:shadow-sm
    active:border-[#666]"
  style={{
    background: "linear-gradient(to bottom, #f5f5f5 0%, #f1f1f1 100%)",
  }}
>
  Contact
</button>
        </div>
      )}

      {/* Quick category links */}
      {!compact && (
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-[13px]">
          {["about", "projects", "professional experience", "writings"].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleSearch(term)}
              className="text-[#1a0dab] hover:underline capitalize"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </form>
  )
}
