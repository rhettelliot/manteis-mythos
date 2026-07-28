'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { generateMythos } from '@/lib/mythosEngine';
import type { MythosResult } from '@/lib/types';
import Gate from '@/components/Gate';
import QuestionFlow from '@/components/QuestionFlow';
import MythosDisplay from '@/components/MythosDisplay';

export default function Home() {
  const [phase, setPhase] = useState<'gate' | 'questions' | 'result'>('gate');
  const [mythos, setMythos] = useState<MythosResult | null>(null);

  useEffect(() => {
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
  }, []);

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
            <Gate onEnter={() => setPhase('questions')} />
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
