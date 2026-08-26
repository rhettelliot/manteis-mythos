import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MYTHOS — Engine of Personal Mythology',
  description: 'Generate your personal mythology from seven questions.',
  openGraph: {
    title: 'MYTHOS — Engine of Personal Mythology',
    description: 'Generate your personal mythology from seven questions.',
    url: 'https://manteis-mythos.vercel.app',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'MYTHOS — Engine of Personal Mythology',
    description: 'Generate your personal mythology from seven questions.',
  },
}

export const viewport = {
  themeColor: '#0D0F12',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://manteis-mythos.vercel.app" />
      </head>
      <body className="bg-canvas text-ink-2 antialiased">{children}</body>
    </html>
  )
}
