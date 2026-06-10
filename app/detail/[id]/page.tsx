import type React from "react"
import Link from "next/link"
import { portfolioData } from "@/lib/portfolio-data"
import { GoogleLogo } from "@/components/google-logo"
import { notFound } from "next/navigation"

interface DetailPageProps {
  params: Promise<{ id: string }>
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { id } = await params
  const item = portfolioData.find((p) => p.id === id)

  if (!item) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#f2f2f2] border-b border-[#ebebeb] px-4 py-4">
        <div className="flex items-center gap-8">
          <Link href="/">
            <GoogleLogo size="small" />
          </Link>
          <Link href={`/search?q=${item.category}`} className="text-[14px] text-[#1a0dab] hover:underline">
            ← Back to {item.category} results
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[800px] mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <div className="text-[13px] text-[#006621] mb-2">{item.url}</div>

        {/* Title */}
        <h1 className="text-[28px] text-[#1a0dab] mb-4">{item.title}</h1>

        {/* Category Badge */}
        <div className="inline-block px-3 py-1 bg-[#f2f2f2] text-[12px] text-[#5f6368] border border-[#dadce0] mb-6 capitalize">
          {item.category}
        </div>

        {/* Description */}
        <div className="text-[16px] text-[#3c4043] leading-relaxed mb-8 border-l-4 border-[#4285f4] pl-4 py-2 bg-[#f8f9fa]">
          {item.description}
        </div>

        {/* Detailed Content based on category */}
        <DetailContent item={item} />

        {/* Related Items */}
        <RelatedItems currentId={id} category={item.category} />
      </main>

      {/* Footer */}
      <footer className="bg-[#f2f2f2] border-t border-[#e4e4e4] py-4 px-4 mt-8">
        <div className="text-center text-[13px] text-[#70757a]">Portfolio of John Doe · Built with love</div>
      </footer>
    </div>
  )
}

function DetailContent({ item }: { item: (typeof portfolioData)[0] }) {
  const categoryContent: Record<string, React.ReactNode> = {
    about: (
      <div className="space-y-6">
        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">Overview</h2>
          <p className="text-[14px] text-[#3c4043] leading-relaxed">
            Welcome to my portfolio! I'm a passionate developer who loves creating elegant solutions to complex
            problems. With a strong foundation in modern web technologies, I bring ideas to life through clean,
            efficient code.
          </p>
        </section>
        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "AWS"].map((tech) => (
              <span key={tech} className="px-3 py-1 bg-white border border-[#dadce0] text-[13px] text-[#3c4043]">
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>
    ),
    experiments: (
      <div className="space-y-6">
        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">
            About This Experiment
          </h2>
          <p className="text-[14px] text-[#3c4043] leading-relaxed">
            This UI experiment explores modern design patterns and interactive elements. Each experiment is built to
            push the boundaries of what's possible with CSS and JavaScript.
          </p>
        </section>
        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">Technologies Used</h2>
          <ul className="list-disc ml-6 text-[14px] text-[#3c4043] space-y-1">
            <li>Pure CSS animations</li>
            <li>CSS custom properties</li>
            <li>Minimal JavaScript</li>
            <li>Modern browser APIs</li>
          </ul>
        </section>
      </div>
    ),
    experience: (
      <div className="space-y-6">
        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">Responsibilities</h2>
          <ul className="list-disc ml-6 text-[14px] text-[#3c4043] space-y-2">
            <li>Led frontend development initiatives</li>
            <li>Implemented design systems and component libraries</li>
            <li>Mentored junior developers</li>
            <li>Collaborated with cross-functional teams</li>
            <li>Optimized application performance</li>
          </ul>
        </section>
        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">Key Achievements</h2>
          <ul className="list-disc ml-6 text-[14px] text-[#3c4043] space-y-2">
            <li>Improved page load time by 40%</li>
            <li>Reduced bundle size by 30%</li>
            <li>Implemented CI/CD pipelines</li>
          </ul>
        </section>
      </div>
    ),
    projects: (
      <div className="space-y-6">
        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">Project Overview</h2>
          <p className="text-[14px] text-[#3c4043] leading-relaxed">
            This project showcases my ability to build full-stack applications from concept to deployment. It
            demonstrates proficiency in modern development practices and user-centered design.
          </p>
        </section>
        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">Features</h2>
          <ul className="list-disc ml-6 text-[14px] text-[#3c4043] space-y-1">
            <li>Responsive design</li>
            <li>Real-time updates</li>
            <li>User authentication</li>
            <li>Data visualization</li>
          </ul>
        </section>
        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">Links</h2>
          <div className="flex gap-4">
            <a href="#" className="text-[14px] text-[#1a0dab] hover:underline">
              View Demo →
            </a>
            <a href="#" className="text-[14px] text-[#1a0dab] hover:underline">
              GitHub Repo →
            </a>
          </div>
        </section>
      </div>
    ),
    writing: (
      <div className="space-y-6">
        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">Article Content</h2>
          <div className="text-[14px] text-[#3c4043] leading-relaxed space-y-4">
            <p>
              This article dives deep into the topic, providing practical examples and best practices that you can apply
              to your own projects immediately.
            </p>
            <p>
              Whether you're a beginner or an experienced developer, you'll find valuable insights that can help improve
              your workflow and code quality.
            </p>
          </div>
        </section>
        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">Topics Covered</h2>
          <ul className="list-disc ml-6 text-[14px] text-[#3c4043] space-y-1">
            <li>Core concepts and fundamentals</li>
            <li>Practical implementation</li>
            <li>Common pitfalls to avoid</li>
            <li>Best practices and tips</li>
          </ul>
        </section>
      </div>
    ),
    contact: (
      <div className="space-y-6">
        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">Get In Touch</h2>
          <p className="text-[14px] text-[#3c4043] leading-relaxed">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel
            free to reach out through any of the channels below!
          </p>
        </section>
        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">Contact Methods</h2>
          <div className="space-y-3">
            <p className="text-[14px]">
              <span className="text-[#5f6368]">Email:</span>{" "}
              <a href="mailto:hello@johndoe.dev" className="text-[#1a0dab] hover:underline">
                hello@johndoe.dev
              </a>
            </p>
            <p className="text-[14px]">
              <span className="text-[#5f6368]">Response Time:</span>{" "}
              <span className="text-[#3c4043]">Usually within 24-48 hours</span>
            </p>
          </div>
        </section>
      </div>
    ),
  }

  return categoryContent[item.category] || null
}

function RelatedItems({ currentId, category }: { currentId: string; category: string }) {
  const related = portfolioData.filter((item) => item.category === category && item.id !== currentId).slice(0, 3)

  if (related.length === 0) return null

  return (
    <section className="mt-10 pt-6 border-t border-[#ebebeb]">
      <h2 className="text-[16px] font-medium text-black mb-4">Related Results</h2>
      <div className="space-y-4">
        {related.map((item) => (
          <div key={item.id}>
            <cite className="text-[12px] text-[#006621] not-italic block">{item.url}</cite>
            <Link href={`/detail/${item.id}`} className="text-[14px] text-[#1a0dab] hover:underline">
              {item.title}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
