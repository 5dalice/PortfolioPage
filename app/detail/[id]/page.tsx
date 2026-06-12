
import type React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { portfolioData } from "@/lib/portfolio-data"
import { SearchHeader } from "@/components/search-header"
import { SearchFooter } from "@/components/search-footer"

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
    
    <div className="min-h-screen bg-white text-black flex flex-col">
      <SearchHeader query={item.category} />

<main className="flex-1 py-4 px-4 md:pl-[180px] md:pr-6">
  <section className="max-w-[652px]">
    <article className="max-w-[600px] mb-6">
      <cite className="text-[14px] text-[#006621] not-italic block mb-1">
        {item.url}
      </cite>

      <h1 className="text-[18px] leading-tight mb-1">
        <span className="text-[#1a0dab] font-normal">
          {item.title}
        </span>
      </h1>

      <p className="text-[13px] text-[#545454] leading-[1.4]">
        {item.description}
      </p>
    </article>

    <article className="max-w-[600px] mb-6">
      <DetailContent item={item} />
    </article>

    <RelatedItems currentId={id} category={item.category} />
  </section>
</main>

      <SearchFooter query={item.category} />
    </div>
  )
}

function DetailContent({ item }: { item: (typeof portfolioData)[0] }) {
  const categoryContent: Record<string, React.ReactNode> = {
    about: (
    
        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Python",
              "Java",
              "C#",
              "JavaScript",
              "TypeScript",
              "SQL",
              "MongoDB",
              "Linux",
              "Git",
              "TCP/IP",
              "React",
              "Next.js",
              "Cybersecurity",
              "Penetration Testing",
              "Digital Forensics",
              "Cloud Security",
            ].map((tech) => (
             <span
  key={tech}
  className="px-3 py-1 bg-[#f1f3f4] border border-[#e8eaed] text-[13px] text-[#202124]"
>
  {tech}
</span>
            ))}
          </div>
        </section>
    ),

    projects: (
      <div className="space-y-6">
        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">
            Project Overview
          </h2>
          <p className="text-[14px] text-[#3c4043] leading-relaxed">
            This section contains a selection of projects developed during my
            studies, professional work, and personal learning. The projects cover
            areas such as software development, web applications, cybersecurity,
            databases, and system design. They reflect technologies and concepts I
            have worked with throughout my academic and professional journey.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">
            What You Will Find
          </h2>
          <ul className="list-disc ml-6 text-[14px] text-[#3c4043] space-y-1">
            <li>Web applications built with modern frameworks</li>
            <li>Cybersecurity and security-focused projects</li>
            <li>Database and backend development work</li>
            <li>Experiments, learning projects, and technical explorations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">
            Source Code
          </h2>
          <p className="text-[14px] text-[#3c4043] leading-relaxed mb-3">
            The source code for the projects presented in this portfolio is
            available on GitHub. Repositories include documentation,
            implementation details, and project-specific information where
            applicable.
          </p>

          <div className="flex gap-4">
            <a
              href="https://github.com/5dalice"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-[#1a0dab] hover:underline"
            >
              View GitHub Profile →
            </a>
          </div>
        </section>
      </div>
    ),

    experience: (
      <div className="space-y-6">
        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">
            Role Overview
          </h2>
          <p className="text-[14px] text-[#3c4043] leading-relaxed">
            This role contributed to my development in communication,
            responsibility, structure, and problem-solving. My professional
            experience has strengthened my ability to work in fast-paced
            environments, understand user and customer needs, and translate
            requirements into practical solutions.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">
            Relevant Skills
          </h2>
          <ul className="list-disc ml-6 text-[14px] text-[#3c4043] space-y-1">
            <li>Customer-focused communication</li>
            <li>Planning, structure, and prioritization</li>
            <li>Problem-solving under time pressure</li>
            <li>Team collaboration and operational responsibility</li>
            <li>Information presentation and digital content handling</li>
          </ul>
        </section>
      </div>
    ),

    writing: (
      <div className="space-y-6">
        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">
            Academic Work
          </h2>
          <p className="text-[14px] text-[#3c4043] leading-relaxed">
            This section contains academic writing and research-related work
            connected to software development, cybersecurity, AI, sustainability,
            and information systems.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">
            Focus Areas
          </h2>
          <ul className="list-disc ml-6 text-[14px] text-[#3c4043] space-y-1">
            <li>Cybersecurity and sustainable computing</li>
            <li>AI, trust, and ethical technology use</li>
            <li>Information systems and digital transformation</li>
            <li>Research methodology and qualitative analysis</li>
          </ul>
        </section>
      </div>
    ),

    contact: (
      <div className="space-y-6">
        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">
            Get In Touch
          </h2>
          <p className="text-[14px] text-[#3c4043] leading-relaxed">
            I am open to opportunities within software development, cybersecurity,
            IT consulting, and related technical roles. Feel free to get in touch
            regarding professional collaborations, project discussions, or career
            opportunities.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-medium text-black mb-3 border-b border-[#ebebeb] pb-2">
            Contact Methods
          </h2>
          <div className="space-y-3">
            <p className="text-[14px]">
              <span className="text-[#5f6368]">Email:</span>{" "}
              <a
                href="mailto:alice.ewaldsen@hotmail.com"
                className="text-[#1a0dab] hover:underline"
              >
                alice.ewaldsen@hotmail.com
              </a>
            </p>

            <p className="text-[14px]">
              <span className="text-[#5f6368]">GitHub:</span>{" "}
              <a
                href="https://github.com/5dalice"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1a0dab] hover:underline"
              >
                github.com/5dalice
              </a>
            </p>

            <p className="text-[14px]">
              <span className="text-[#5f6368]">LinkedIn:</span>{" "}
              <a
                href="https://linkedin.com/in/alice-ewaldsen"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1a0dab] hover:underline"
              >
                linkedin.com/in/alice-ewaldsen
              </a>
            </p>
          </div>
        </section>
      </div>
    ),
  }

  return categoryContent[item.category] || null
}

function RelatedItems({
  currentId,
  category,
}: {
  currentId: string
  category: string
}) {
  const related = portfolioData
    .filter((item) => item.category === category && item.id !== currentId)
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <section className="max-w-[600px] mt-10 pt-6 border-t border-[#ebebeb]">
      <h2 className="text-[16px] font-medium text-black mb-4">
        Related Results
      </h2>

      <div className="space-y-4">
        {related.map((item) => (
          <div key={item.id}>
            <cite className="text-[12px] text-[#006621] not-italic block">
              {item.url}
            </cite>

            <Link
              href={`/detail/${item.id}`}
              className="text-[14px] text-[#1a0dab] hover:underline"
            >
              {item.title}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}