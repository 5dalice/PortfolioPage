import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Alice Ewaldsen - Portfolio",
  description:
    "Portfolio for Alice Ewaldsen, focused on software development, cybersecurity, projects, academic work, experience, and contact information.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/logo1.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo1.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon1.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="m-0 p-0">
      <body className="font-sans antialiased m-0 p-0 min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  )
}