"use client";

import { motion } from "framer-motion";
import { generateSigil } from "@/lib/sigil";

export default function Sigil({ seed, size = 280 }: { seed: string; size?: number }) {
  return (
    <div
      className="relative rounded-none"
      style={{
        width: size,
        height: size,
        boxShadow: "0 0 60px rgba(255, 77, 0, 0.15)",
      }}
    >
      <motion.div
        className="w-full h-full rounded-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{
          opacity: { duration: 1.2, ease: "easeOut" },
          scale: { duration: 1.2, ease: "easeOut" },
          rotate: { duration: 60, ease: "linear", repeat: Infinity },
        }}
        dangerouslySetInnerHTML={{ __html: generateSigil(seed) }}
        style={{ width: size, height: size }}
      />
    </div>
  );
}
