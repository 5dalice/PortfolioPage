export interface SearchResult {
  id: string
  title: string
  url: string
  href?: string
  description: string
  category: string
}

export const portfolioData: SearchResult[] = [
  {
    id: "about-1",
    title: "About Me - Alice Ewaldsen | Cybersecurity & Software Development",
    url: "aliceewaldsen.dev/about",
    description:
      "System developer with a multidisciplinary background spanning technology, leadership, and business operations. Driven by problem-solving, continuous learning, and the development of efficient solutions that create long-term value for both organizations and users.",
    category: "about",
  },
  {
    id: "about-2",
    title: "Technical Skills & Technologies",
    url: "aliceewaldsen.dev/about/skills",
    description:
      "Proficient in C#, .NET, Java, Python, SQL, MongoDB, JavaScript, TypeScript, React, Linux, Git, REST APIs, and database modeling. Experienced with system integration, TCP/IP networking, cloud environments, and agile development practices including Scrum and Kanban.",
    category: "about",
  },
  {
    id: "about-3",
    title: "Education & Academic Background",
    url: "aliceewaldsen.dev/about/education",
    description:
      "Holds a B.Sc. in Systems Development and an M.Sc. in Cybersecurity from University West. Specialized in penetration testing, digital forensics, cloud security, AI-assisted risk assessment, and sustainable computing. Research includes studies on trust in AI-driven recruitment and the environmental impact of intrusion detection systems.",
    category: "about",
  },

  // Experience
  {
    id: "work-0",
    title: "404: Employer Not Found (2026–?)",
    url: "aliceewaldsen.dev/contact",
    href: "mailto:alice.ewaldsen@hotmail.com",
    description:
      "The requested employer could not be found. If you are hiring a software developer with a master's degree in cybersecurity, please try again via the Contact section.",
    category: "experience",
  },
  {
    id: "work-1",
    title: "Sales Associate at Indiska (2024–Present)",
    url: "aliceewaldsen.dev/experience/indiska",
    description:
      "Working with customer engagement and sales in a target-driven environment. Developed strong analytical and communication skills by identifying customer needs and translating them into practical solutions. Also responsible for digital merchandising, social media content, and information presentation.",
    category: "experience",
  },
  {
    id: "work-2",
    title: "Team Leader at Willys (2019–2024)",
    url: "aliceewaldsen.dev/experience/willys",
    description:
      "Managed daily operations in a fast-paced retail environment, including workforce planning, resource allocation, and onboarding of new employees. Strengthened leadership, decision-making, and problem-solving skills while contributing to regional and national sales competition successes.",
    category: "experience",
  },
  {
    id: "work-3",
    title: "Production Operator at Volvo Cars (2017–2019)",
    url: "aliceewaldsen.dev/experience/volvo-cars",
    description:
      "Worked in automotive production with a strong focus on quality assurance, precision, and standardized processes. Developed a structured and methodical approach to work, gaining valuable experience in process optimization, teamwork, and quality control.",
    category: "experience",
  },

  // Projects
  {
    id: "proj-1",
    title: "Weather App - Real-Time Weather Dashboard",
    url: "aliceewaldsen.dev/projects/weather-app",
    href: "/projects/weather-app",
    description:
      "A weather application that fetches real-time weather data from a free public API. The project includes city-based search, current temperature, humidity, wind speed, and a responsive interface built with React, TypeScript, and Next.js.",
    category: "projects",
  },


  // Writing
  {
    id: "blog-1",
    title: "Master's Thesis: Security is not Carbon-Free (2026)",
    url:"",
    description:
      "Research on sustainable cybersecurity that investigates how Wi-Fi Intrusion Detection Systems affect energy consumption and carbon emissions. The study compares static, adaptive, and hybrid IDS approaches through simulation-based experiments, analyzing the balance between detection performance, resource usage, and environmental impact.",
    category: "writing",
  },
  {
    id: "blog-2",
    title: "Bachelor's Thesis: Trust in AI in Recruitment - (2025)",
    url: "http://www.diva-portal.org/smash/record.jsf?pid=diva2:1971051",
    description:
      "Bachelor's thesis in Information Systems exploring recruiters' trust in AI-powered screening tools. Based on qualitative interviews with recruiters from both public and private sectors, the study investigates the factors influencing AI adoption, including transparency, explainability, perceived reliability, ethical concerns, and user acceptance.",
    category: "writing",
  },

  // Contact/Reach
  {
    id: "contact-1",
    title: "Contact Me - Alice Ewaldsen",
    url: "Contact",
    href: "mailto:alice.ewaldsen@hotmail.com",
    description:
      "Get in touch regarding software development, cybersecurity, consulting opportunities, or professional collaborations.",
    category: "contact",
  },
  {
    id: "contact-2",
    title: "GitHub Profile - @5dalice",
    url: "https://github.com/5dalice",
    href: "https://github.com/5dalice",
    description:
      "All projects featured in this portfolio are available as open-source repositories on GitHub. Browse the source code, technical implementations, and ongoing development work.",
    category: "contact",
  },
  {
    id: "contact-3",
    title: "LinkedIn - Alice Ewaldsen",
    url: "https://linkedin.com/in/alice-ewaldsen",
    href: "https://linkedin.com/in/alice-ewaldsen",
    description:
      "Connect with me on LinkedIn for professional networking, career opportunities, and industry-related discussions.",
    category: "contact",
  },
]

export const searchSuggestions = [
  "about",
  "about alice ewaldsen",
  "experiments",
  "ui experiments",
  "experience",
  "work experience",
  "projects",
  "portfolio projects",
  "weather app",
  "writing",
  "blog posts",
  "contact",
  "reach out",
  "skills",
  "github",
]

export const categoryMap: Record<string, string[]> = {
  about: ["about", "who", "skills", "education", "background", "alice"],
  experiments: ["experiments", "ui", "components", "css", "animation"],
  experience: ["experience", "work", "job", "career", "employment"],
  projects: ["projects", "portfolio", "apps", "built", "created", "weather", "weather app"],
  writing: ["writing", "blog", "posts", "articles", "thoughts", "examensarbete", "thesis"],
  contact: ["contact", "reach", "email", "social", "connect", "github", "linkedin"],
}

export function searchPortfolio(query: string): SearchResult[] {
  const lowerQuery = query.toLowerCase().trim()

  if (!lowerQuery) return []

  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some((keyword) => lowerQuery.includes(keyword))) {
      return portfolioData.filter((item) => item.category === category)
    }
  }

  return portfolioData.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery),
  )
}