"use client";

import { motion } from "framer-motion";

export function Generating() {
  return (
    <motion.div
      key="generating"
      className="min-h-screen flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-64 h-64 relative mb-8">
        <motion.div
          className="absolute inset-0 border border-mythos-orange/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-4 border border-mythos-blue/30"
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,77,0,0.15)_0%,_transparent_70%)]"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] tracking-[0.3em] text-mythos-orange/70">
          SUMMONING
        </div>
      </div>

      <p className="font-mono text-[10px] tracking-[0.25em] text-mythos-bone/40 animate-pulse-slow">
        WEAVING ORIGIN — CURRENT — PROPHECY
      </p>
    </motion.div>
  );
}
