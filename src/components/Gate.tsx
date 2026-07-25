"use client";

import { motion } from "framer-motion";

interface GateProps {
  onEnter: () => void;
  onResume?: () => void;
}

export function Gate({ onEnter, onResume }: GateProps) {
  return (
    <motion.div
      key="gate"
      className="min-h-screen flex flex-col items-center justify-center px-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="absolute inset-0 scanlines pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,77,0,0.08)_0%,_transparent_60%)] pointer-events-none" />

      <motion.p
        className="font-mono text-[10px] tracking-[0.4em] text-mythos-orange/70 mb-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 34 }}
      >
        MANTEIS SYSTEMS // MYTHOS ENGINE
      </motion.p>

      <motion.h1
        className="font-sans font-extralight text-[clamp(2.5rem,10vw,7rem)] leading-[0.9] tracking-tight text-center text-mythos-bone mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, type: "spring", stiffness: 450, damping: 34 }}
      >
        MYTHOS
      </motion.h1>

      <motion.p
        className="font-mono text-xs tracking-[0.2em] text-mythos-bone/50 mb-16 max-w-lg text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        ANSWER SEVEN QUESTIONS. RECEIVE YOUR PERSONAL MYTHOLOGY.
      </motion.p>

      <motion.button
        onClick={onEnter}
        className="glass-orange px-10 py-4 font-mono text-xs tracking-[0.3em] text-mythos-orange hover:bg-mythos-orange/10 active:scale-[0.98] transition-colors"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, type: "spring", stiffness: 500, damping: 34 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        ENTER THE MYTHOS
      </motion.button>

      {onResume && (
        <motion.button
          onClick={onResume}
          className="mt-6 text-mythos-bone/40 font-mono text-[10px] tracking-[0.2em] hover:text-mythos-bone/70 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
        >
          RETURN TO YOUR MYTHOS
        </motion.button>
      )}
    </motion.div>
  );
}
