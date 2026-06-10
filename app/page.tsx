import { GoogleLogo } from "@/components/google-logo"
import { SearchBar } from "@/components/search-bar"

export default function HomePage() {
  return (
    <div className="h-screen w-full bg-white flex flex-col m-0 p-0 overflow-hidden">
      {/* Header Links - classic Google style */}
      <header className="flex justify-end items-center gap-4 px-4 py-2 text-[13px]">
        <a href="#" className="text-[#1a0dab] hover:underline">
          Gmail
        </a>
        <a href="#" className="text-[#1a0dab] hover:underline">
          Images
        </a>
        <span className="text-[#70757a]">|</span>
        <a href="#" className="text-[#1a0dab] hover:underline">
          Sign in
        </a>
      </header>

      {/* Main Content - perfectly centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <GoogleLogo size="large" />

        <div className="mt-6 w-full max-w-[584px]">
          <SearchBar autoFocus />
        </div>

        {/* Subtitle */}
        <p className="mt-6 text-[13px] text-[#545454]">
          Search: about, projects, experience, writings        </p>
      </main>

      {/* Footer - classic Google footer */}
      <footer className="bg-[#f2f2f2] text-[13px] mt-auto">
        <div className="px-6 py-2 border-b border-[#dadce0] text-[#70757a]">India</div>
        <div className="px-6 py-2 flex flex-col sm:flex-row justify-between gap-2">
          <div className="flex flex-wrap gap-6 text-[#70757a]">
            <a href="#" className="hover:underline">
              Advertising
            </a>
            <a href="#" className="hover:underline">
              Business
            </a>
            <a href="#" className="hover:underline">
              About
            </a>
          </div>
          <div className="flex flex-wrap gap-6 text-[#70757a]">
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <a href="#" className="hover:underline">
              Settings
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
