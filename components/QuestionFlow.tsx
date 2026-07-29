'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface QuestionFlowProps {
  onComplete: (answers: string[]) => void
  onBack: () => void
}

const QUESTIONS = [
  'What force first shaped the world you were born into?',
  'Before language, what did your body know to be true?',
  'What have you sacrificed without ever naming it?',
  'What returns to you in dreams, again and again?',
  'What truth do you speak only in silence?',
  'What are you becoming, despite yourself?',
  'If your story ended tomorrow, what would outlive you?',
]

export default function QuestionFlow({ onComplete, onBack }: QuestionFlowProps) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<string[]>(Array(QUESTIONS.length).fill(''))
  const [direction, setDirection] = useState(1)

  const currentAnswer = answers[current] || ''

  const handleAnswerChange = (value: string) => {
    const next = [...answers]
    next[current] = value
    setAnswers(next)
  }

  const handleNext = () => {
    if (!currentAnswer.trim()) return
    if (current < QUESTIONS.length - 1) {
      setDirection(1)
      setCurrent((c) => c + 1)
    } else {
      onComplete(answers)
    }
  }

  const handleBack = () => {
    if (current > 0) {
      setDirection(-1)
      setCurrent((c) => c - 1)
    } else {
      onBack()
    }
  }

  const progress = ((current + 1) / QUESTIONS.length) * 100
  const isLast = current === QUESTIONS.length - 1
  const counter = `${String(current + 1).padStart(2, '0')} / ${String(QUESTIONS.length).padStart(2, '0')}`

  return (
    <div className="min-h-screen w-full bg-black flex flex-col">
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-white/10 z-50">
        <motion.div
          className="h-full bg-orange"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="fixed top-6 right-6 font-mono text-xs tracking-[0.2em] text-white/40 z-50">
        {counter}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full max-w-2xl flex flex-col items-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-medium text-white text-center leading-tight tracking-[-0.02em] mb-12">
              {QUESTIONS[current]}
            </h2>

            <textarea
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full min-h-[120px] bg-black border border-white/[0.12] p-5 font-mono text-white placeholder:text-white/30 focus:border-orange focus:outline-none resize-none text-sm leading-relaxed"
              autoFocus
            />

            <div className="mt-8 w-full flex items-center justify-end">
              <button
                onClick={handleNext}
                disabled={!currentAnswer.trim()}
                className="font-mono text-sm tracking-[0.2em] text-orange uppercase disabled:opacity-30 disabled:hover:no-underline hover:underline underline-offset-4 transition-opacity"
              >
                {isLast ? 'Forge the Mythos →' : 'Continue →'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={handleBack}
          className="font-mono text-xs tracking-[0.15em] text-white/30 uppercase hover:text-white/60 transition-colors"
        >
          ← Back
        </button>
      </div>
    </div>
  )
}
