'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QuestionFlow from '@/components/QuestionFlow'
import MythosDisplay from '@/components/MythosDisplay'
import { generateMythos } from '@/lib/mythos'
import { saveMythos, loadMythos, clearMythos } from '@/lib/storage'
import { decodeShareURL } from '@/lib/share'
import type { MythosData } from '@/lib/types'

type AppState = 'questions' | 'generating' | 'mythos'

export default function Home() {
  const [state, setState] = useState<AppState>('questions')
  const [answers, setAnswers] = useState<string[]>([])
  const [mythos, setMythos] = useState<MythosData | null>(null)
  const [isHydrated, setIsHydrated] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const hash = window.location.hash
    if (hash) {
      const shared = decodeShareURL(hash)
      if (shared && shared.length > 0) {
        const data = generateMythos(shared)
        setAnswers(shared)
        setMythos(data)
        saveMythos({ mythos: data, answers: shared })
        setState('mythos')
        window.location.hash = ''
        return
      }
    }

    const saved = loadMythos()
    if (saved) {
      setAnswers(saved.answers)
      setMythos(saved.mythos)
      setState('mythos')
    }
  }, [])

  useEffect(() => {
    if (state !== 'generating') return
    if (answers.length === 0) return

    const timer = setTimeout(() => {
      const data = generateMythos(answers)
      setMythos(data)
      saveMythos({ mythos: data, answers })
      setState('mythos')
    }, 2000)

    return () => clearTimeout(timer)
  }, [state, answers])

  const handleQuestionsComplete = useCallback((completedAnswers: string[]) => {
    setAnswers(completedAnswers)
    setState('generating')
  }, [])

  const handleReset = useCallback(() => {
    if (typeof window !== 'undefined') {
      clearMythos()
    }
    setAnswers([])
    setMythos(null)
    setState('questions')
  }, [])

  return (
    <main className="min-h-screen bg-canvas overflow-x-hidden">
      <AnimatePresence mode="wait">
        {state === 'questions' && (
          <motion.div
            key="questions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <QuestionFlow
              onComplete={handleQuestionsComplete}
              onBack={() => setState('questions')}
            />
          </motion.div>
        )}
        {state === 'generating' && (
          <motion.div
            key="generating"
            className="min-h-screen flex flex-col items-center justify-center bg-canvas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-48 h-48 mb-8">
              <motion.div
                className="absolute inset-0 border border-orange/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-4 border border-signal/30"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-8 border border-orange/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-0 bg-orange/5"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <h2 className="font-mono text-sm tracking-[0.3em] text-orange uppercase">
              Forging
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ...
              </motion.span>
            </h2>
            <p className="mt-4 font-mono text-xs text-ink-3 tracking-widest">
              ALIGNING ARCHETYPES
            </p>
          </motion.div>
        )}
        {state === 'mythos' && mythos && (
          <motion.div
            key="mythos"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MythosDisplay
              mythos={mythos}
              answers={answers}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}