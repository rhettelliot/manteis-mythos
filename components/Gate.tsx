'use client';

import { motion } from 'framer-motion';

interface GateProps {
  onEnter: () => void;
}

export default function Gate({ onEnter }: GateProps) {
  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Ambient rotating geometry */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute h-[32rem] w-[32rem] border border-orange/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute h-[24rem] w-[24rem] border border-blue/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute h-[16rem] w-[16rem] border border-orange/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '4rem 4rem',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-7xl sm:text-9xl font-bold tracking-[-0.04em] text-white"
        >
          MYTHOS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-6 max-w-md text-sm sm:text-base tracking-[0.2em] uppercase text-white/60"
        >
          Seven questions stand between you and your mythology.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-12"
        >
          <motion.button
            onClick={onEnter}
            whileHover={{
              backgroundColor: '#FF4D00',
              color: '#000000',
              boxShadow: '0 0 32px rgba(255, 77, 0, 0.35)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="border-2 border-orange px-12 py-4 text-sm font-medium uppercase tracking-[0.3em] text-orange bg-transparent"
          >
            Enter the Mythos
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
