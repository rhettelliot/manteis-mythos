"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Sigil } from "./Sigil";
import { Typewriter } from "./Typewriter";
import type { MythosData } from "@/lib/mythos";

interface MythosDocumentProps {
  mythos: MythosData;
  onReset: () => void;
}

export function MythosDocument({ mythos, onReset }: MythosDocumentProps) {
  const [chapterDone, setChapterDone] = useState<boolean[]>([false, false, false]);

  const handleChapterComplete = useCallback((idx: number) => {
    setChapterDone((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 scanlines pointer-events-none z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,122,255,0.05)_0%,_transparent_60%)] pointer-events-none z-0" />

      <main className="relative z-20 max-w-3xl mx-auto px-6 py-16 print:py-8">
        <header className="text-center mb-16 print:mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 450, damping: 34 }}
            className="flex justify-center mb-8"
          >
            <Sigil svg={mythos.sigilSvg} size="lg" animate />
          </motion.div>

          <motion.p
            className="font-mono text-[10px] tracking-[0.4em] text-mythos-orange mb-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            PERSONAL MYTHOS
          </motion.p>

          <motion.h1
            className="font-sans font-extralight text-[clamp(2rem,7vw,4.5rem)] leading-[0.95] tracking-tight text-mythos-bone"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 450, damping: 34 }}
          >
            {mythos.name}
          </motion.h1>
        </header>

        <section className="space-y-12 mb-16 print:space-y-8 print:mb-10">
          {mythos.chapters.map((chapter, idx) => (
            <motion.article
              key={chapter.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.15, type: "spring", stiffness: 450, damping: 34 }}
            >
              <p className="font-mono text-[10px] tracking-[0.35em] text-mythos-orange/80 mb-3">{chapter.title}</p>
              <div className="font-sans font-light text-lg leading-relaxed text-mythos-bone/90 print:text-base">
                <Typewriter
                  text={chapter.body}
                  speed={18}
                  active={idx === 0 || chapterDone[idx - 1]}
                  onComplete={() => handleChapterComplete(idx)}
                />
              </div>
            </motion.article>
          ))}
        </section>

        <motion.aside
          className="solid-blue p-6 mb-16 print:mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, type: "spring", stiffness: 450, damping: 34 }}
        >
          <p className="font-mono text-[10px] tracking-[0.35em] text-mythos-blue mb-3">ARCHETYPE</p>
          <h3 className="font-sans font-extralight text-2xl text-mythos-bone mb-2">{mythos.archetype.name}</h3>
          <p className="font-sans font-light text-sm text-mythos-bone/70">{mythos.archetype.description}</p>
        </motion.aside>

        <motion.div
          className="flex items-center justify-center gap-4 no-print"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <button
            onClick={handleShare}
            className="solid px-5 py-3 font-mono text-[10px] tracking-[0.2em] text-mythos-bone hover:bg-mythos-bone/5 transition-colors"
          >
            COPY LINK
          </button>
          <button
            onClick={handlePrint}
            className="solid-blue px-5 py-3 font-mono text-[10px] tracking-[0.2em] text-mythos-blue hover:bg-mythos-blue/10 transition-colors"
          >
            DOWNLOAD PDF
          </button>
          <button
            onClick={onReset}
            className="solid-orange px-5 py-3 font-mono text-[10px] tracking-[0.2em] text-mythos-orange hover:bg-mythos-orange/10 transition-colors"
          >
            NEW MYTHOS
          </button>
        </motion.div>
      </main>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body,
          html {
            background: #000 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .scanlines {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
