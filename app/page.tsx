'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Gate from '@/components/Gate';
import QuestionFlow from '@/components/QuestionFlow';
import MythosDisplay from '@/components/MythosDisplay';
import PantheonBuilder from '@/components/PantheonBuilder';

import { generateMythos } from '@/lib/mythosEngine';
import type { MythosResult } from '@/lib/types';

export default function Home() {
  const [phase, setPhase] = useState<'gate' | 'mode' | 'questions' | 'pantheon' | 'result'>('gate');
  const [mythos, setMythos] = useState<MythosResult | null>(null);

  useState(() => {
    try {
      const saved = localStorage.getItem('mythos-saved');
      if (saved) {
        const parsed = JSON.parse(saved) as MythosResult;
        setMythos(parsed);
        setPhase('result');
      }
    } catch {
      // Ignore malformed saved data.
    }
  });

  return (
    <main className="min-h-screen bg-black text-white">
      <AnimatePresence mode="wait">
        {phase === 'gate' && (
          <motion.div
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Gate onEnter={() => setPhase('mode')} />
          </motion.div>
        )}

        {phase === 'mode' && (
          <motion.div
            key="mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black px-6"
          >
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setPhase('questions')}
                className="group relative border border-white/10 p-8 md:p-12 text-left hover:border-[#FF4D00] transition rounded-none bg-transparent"
              >
                <p className="text-xs tracking-[0.3em] uppercase text-[#FF4D00] mb-4">Oracle Mode</p>
                <h2 className="text-3xl md:text-4xl font-light tracking-tighter text-white mb-4">
                  Answer the Seven
                </h2>
                <p className="text-sm leading-relaxed text-white/50">
                  Respond to seven questions and receive a generated personal mythology with
                  archetype, origin, current chapter, and prophecy.
                </p>
                <div className="mt-8 text-xs tracking-[0.25em] uppercase text-white/30 group-hover:text-[#FF4D00] transition">
                  Enter →
                </div>
              </button>

              <button
                onClick={() => setPhase('pantheon')}
                className="group relative border border-white/10 p-8 md:p-12 text-left hover:border-[#007AFF] transition rounded-none bg-transparent"
              >
                <p className="text-xs tracking-[0.3em] uppercase text-[#007AFF] mb-4">Pantheon Builder</p>
                <h2 className="text-3xl md:text-4xl font-light tracking-tighter text-white mb-4">
                  Assemble a Court
                </h2>
                <p className="text-sm leading-relaxed text-white/50">
                  Select up to six deities across world traditions and weave a court of forces that
                  generates a combined mythos reading.
                </p>
                <div className="mt-8 text-xs tracking-[0.25em] uppercase text-white/30 group-hover:text-[#007AFF] transition">
                  Enter →
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {phase === 'questions' && (
          <motion.div
            key="questions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <QuestionFlow
              onComplete={(answers) => {
                const result = generateMythos(answers);
                setMythos(result);
                localStorage.setItem('mythos-saved', JSON.stringify(result));
                setPhase('result');
              }}
            />
          </motion.div>
        )}

        {phase === 'pantheon' && (
          <motion.div
            key="pantheon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PantheonBuilder />
          </motion.div>
        )}

        {phase === 'result' && mythos && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MythosDisplay
              result={mythos}
              onRestart={() => {
                localStorage.removeItem('mythos-saved');
                setMythos(null);
                setPhase('gate');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
