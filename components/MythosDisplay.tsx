"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MythosResult } from "@/lib/types";
import { encodeAnswers } from "@/lib/mythosEngine";
import Sigil from "@/components/Sigil";

interface TypewriterProps {
  text: string;
  speed?: number;
  onDone?: () => void;
  startDelay?: number;
  active?: boolean;
}

function Typewriter({ text, speed = 18, onDone, startDelay = 0, active = true }: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!active) return;
    if (!text) {
      onDone?.();
      return;
    }

    let index = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          if (intervalId) clearInterval(intervalId);
          onDone?.();
        }
      }, speed);
    }, startDelay);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, onDone, startDelay, active]);

  return (
    <div className="relative">
      <span className="typewriter-reveal whitespace-pre-wrap">{displayed}</span>
      <span className="typewriter-full" style={{ display: "none" }}>
        {text}
      </span>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.22,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function MythosDisplay({ result, onRestart }: { result: MythosResult; onRestart: () => void }) {
  const [copied, setCopied] = useState(false);
  const [stage, setStage] = useState(0);

  const archetypeLabel = result.archetype.toLowerCase().startsWith("the")
    ? result.archetype.toUpperCase()
    : `THE ${result.archetype.toUpperCase()}`;

  return (
    <div className="mythos-printable min-h-screen bg-black px-6 py-16">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .typewriter-reveal { display: none !important; }
          .typewriter-full { display: block !important; }
          .mythos-printable { background: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-3xl mx-auto flex flex-col items-center"
      >
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-light tracking-tighter text-white text-center"
        >
          {result.name}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-4 text-sm tracking-[0.4em] uppercase text-[#007AFF] text-center"
        >
          {archetypeLabel}
        </motion.p>

        <motion.div variants={itemVariants} className="mt-10 mb-16 flex justify-center">
          <Sigil seed={result.seed} size={280} />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full bg-white/5 border border-white/10 backdrop-blur-xl p-8 mb-6 rounded-none">
          <p className="text-xs tracking-[0.3em] uppercase text-[#FF4D00] mb-4">Origin</p>
          <div className="text-lg leading-relaxed text-white/90 font-light">
            <Typewriter text={result.origin} active={stage >= 0} onDone={() => setStage((s) => Math.max(s, 1))} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full bg-white/5 border border-white/10 backdrop-blur-xl p-8 mb-6 rounded-none">
          <p className="text-xs tracking-[0.3em] uppercase text-[#FF4D00] mb-4">Current Chapter</p>
          <div className="text-lg leading-relaxed text-white/90 font-light">
            <Typewriter text={result.current} active={stage >= 1} onDone={() => setStage((s) => Math.max(s, 2))} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full bg-white/5 border border-white/10 backdrop-blur-xl p-8 mb-6 rounded-none">
          <p className="text-xs tracking-[0.3em] uppercase text-[#FF4D00] mb-4">Prophecy</p>
          <div className="text-lg leading-relaxed text-white/90 font-light">
            <Typewriter text={result.prophecy} active={stage >= 2} />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="no-print w-full flex flex-wrap gap-4 justify-center mt-8"
        >
          <button
            onClick={() => window.print()}
            className="border border-white/20 text-white/80 px-6 py-3 text-xs tracking-[0.25em] uppercase hover:border-[#FF4D00] hover:text-[#FF4D00] rounded-none transition bg-transparent"
          >
            Download PDF
          </button>

          <button
            onClick={() => {
              const data = encodeAnswers(result.answers);
              const url = `${window.location.origin}/share?d=${data}`;
              navigator.clipboard.writeText(url).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              });
            }}
            className="border border-white/20 text-white/80 px-6 py-3 text-xs tracking-[0.25em] uppercase hover:border-[#FF4D00] hover:text-[#FF4D00] rounded-none transition bg-transparent"
          >
            {copied ? "Copied" : "Share"}
          </button>

          <button
            onClick={onRestart}
            className="border border-white/20 text-white/80 px-6 py-3 text-xs tracking-[0.25em] uppercase hover:border-[#FF4D00] hover:text-[#FF4D00] rounded-none transition bg-transparent"
          >
            Begin Again
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
