'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Sigil from '@/components/Sigil'
import Typewriter from '@/components/Typewriter'
import GlassPanel from '@/components/GlassPanel'
import { generateShareURL } from '@/lib/share'
import type { MythosData } from '@/lib/types'

interface MythosDisplayProps {
  mythos: MythosData
  answers: string[]
  onReset: () => void
}

export default function MythosDisplay({ mythos, answers, onReset }: MythosDisplayProps) {
  const [completedChapters, setCompletedChapters] = useState(0)
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle')

  const handleChapterComplete = useCallback(() => {
    setCompletedChapters((c) => Math.min(c + 1, 3))
  }, [])

  const handleShare = async () => {
    if (typeof window === 'undefined') return

    const hash = generateShareURL(answers)
    const url = `${window.location.origin}${window.location.pathname}${hash}`

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = url
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      setShareStatus('copied')
      setTimeout(() => setShareStatus('idle'), 2000)
    } catch {
      setShareStatus('idle')
    }
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const chapters = [
    { label: 'Origin', text: mythos.origin },
    { label: 'The Current Chapter', text: mythos.current },
    { label: mythos.variant === 'shamanic' ? 'Shamanic Journey' : mythos.variant === 'oracular' ? 'Oracular Reading' : 'Prophecy', text: mythos.prophecy },
  ]

  return (
    <div className="min-h-screen bg-black pb-32">
      <div id="mythos-print-area" className="max-w-3xl mx-auto px-6 pt-20 sm:pt-28">
        <header className="text-center mb-16">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-sans font-bold text-white tracking-[-0.05em] uppercase mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {mythos.name}
          </motion.h1>
          <motion.p
            className="font-mono text-sm tracking-[0.3em] text-orange uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Archetype: {mythos.archetype}
          </motion.p>
        </header>

        <motion.div
          className="flex justify-center mb-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Sigil sigil={mythos.sigil} />
        </motion.div>

        <section className="space-y-16">
          {chapters.map((chapter, index) => (
            <article key={chapter.label}>
              <div className="flex items-center gap-4 mb-4">
                <h2 className="font-mono text-xs tracking-[0.3em] text-orange uppercase">
                  {chapter.label}
                </h2>
                <div className="flex-1 h-px bg-orange/40" />
              </div>
              <div className="font-serif text-lg sm:text-xl text-white leading-relaxed max-w-2xl mx-auto">
                {index <= completedChapters ? (
                  <Typewriter
                    text={chapter.text}
                    speed={15}
                    onComplete={index === completedChapters ? handleChapterComplete : undefined}
                  />
                ) : (
                  <span className="opacity-0"> </span>
                )}
              </div>
            </article>
          ))}
        </section>

        <motion.div
          className="mt-20 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: completedChapters >= 3 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassPanel className="max-w-2xl w-full text-center">
            <p className="font-serif text-lg text-white/80 italic leading-relaxed">
              {mythos.archetypeDescription}
            </p>
          </GlassPanel>
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/[0.08] z-50 print:hidden">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between sm:justify-end gap-4">
          <button
            onClick={handlePrint}
            className="font-mono text-xs tracking-[0.15em] text-white/60 uppercase px-4 py-3 border border-white/20 hover:border-orange hover:text-orange transition-colors"
          >
            ↓ Download PDF
          </button>
          <button
            onClick={handleShare}
            className="font-mono text-xs tracking-[0.15em] text-white/60 uppercase px-4 py-3 border border-white/20 hover:border-orange hover:text-orange transition-colors"
          >
            {shareStatus === 'copied' ? '↗ Copied' : '↗ Share'}
          </button>
          <button
            onClick={onReset}
            className="font-mono text-xs tracking-[0.15em] text-white/60 uppercase px-4 py-3 border border-white/20 hover:border-orange hover:text-orange transition-colors"
          >
            ↺ Begin Again
          </button>
        </div>
      </div>
    </div>
  )
}
