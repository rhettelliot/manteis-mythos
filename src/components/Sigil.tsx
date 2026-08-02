"use client";

import { motion } from "framer-motion";

interface SigilProps {
  svg: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animate?: boolean;
}

export function Sigil({ svg, size = "md", className = "", animate = true }: SigilProps) {
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-64 h-64",
    xl: "w-80 h-80",
  };

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 34 }}
      dangerouslySetInnerHTML={{ __html: svg }}
      aria-hidden="true"
    >
      {animate && (
        <style jsx>{`
          :global(.sigil-svg path),
          :global(.sigil-svg circle),
          :global(.sigil-svg line),
          :global(.sigil-svg rect) {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: draw-sigil 4s ease-out forwards;
          }
        `}</style>
      )}
    </motion.div>
  );
}
