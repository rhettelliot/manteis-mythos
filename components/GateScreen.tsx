'use client'

import { motion } from 'framer-motion'

interface GateScreenProps {
  onEnter: () => void
}

export default function GateScreen({ onEnter }: GateScreenProps) {
  return (
    <div className="relative min-h-screen w-full bg-black flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange/5"
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-sans font-bold tracking-[-0.05em] text-white uppercase mb-4">
          MYTHOS
        </h1>
        <p className="font-mono text-xs sm:text-sm tracking-[0.25em] text-white/50 uppercase mb-12">
          Engine of Personal Mythology
        </p>

        <button
          onClick={onEnter}
          className="group relative px-10 py-5 border border-orange bg-transparent text-orange font-mono text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:bg-orange hover:text-black hover:tracking-[0.25em]"
        >
          ENTER THE MYTHOS
        </button>

        <p className="mt-8 font-mono text-xs tracking-[0.15em] text-white/30 uppercase">
          7 questions. 1 mythology.
        </p>
      </motion.div>
    </div>
  )
}
