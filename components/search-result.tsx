import Link from "next/link"
import type { SearchResult as SearchResultType } from "@/lib/portfolio-data"

interface SearchResultProps {
  result: SearchResultType
}

export function SearchResult({ result }: SearchResultProps) {
  const linkHref = result.href ?? result.url

  const isMailLink = linkHref.startsWith("mailto:")
  const isPdfLink = linkHref.endsWith(".pdf")

  const isExternalLink =
    linkHref.startsWith("http://") ||
    linkHref.startsWith("https://") ||
    linkHref.includes("github.com") ||
    linkHref.includes("linkedin.com") ||
    linkHref.includes("twitter.com") ||
    linkHref.includes("x.com")

  return (
    <article className="max-w-[600px] mb-6">
      <cite className="text-[14px] text-[#006621] not-italic block mb-1">
        {result.url}
      </cite>

      <h3 className="text-[18px] leading-tight mb-1">
        {result.href?.startsWith("/") ? (
          <Link
            href={result.href}
            className="text-[#1a0dab] hover:underline visited:text-[#660099]"
          >
            {result.title}
          </Link>
        ) : isMailLink || isPdfLink || isExternalLink ? (
          <a
            href={linkHref}
            target={isMailLink ? undefined : "_blank"}
            rel={isMailLink ? undefined : "noopener noreferrer"}
            className="text-[#1a0dab] hover:underline visited:text-[#660099]"
          >
            {result.title}
          </a>
        ) : (
          <Link
            href={`/detail/${result.id}`}
            className="text-[#1a0dab] hover:underline visited:text-[#660099]"
          >
            {result.title}
          </Link>
        )}
      </h3>

      <p className="text-[13px] text-[#545454] leading-[1.4]">
        {result.description}
      </p>
    </article>
  )
}