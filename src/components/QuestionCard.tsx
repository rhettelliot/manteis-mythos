"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ProgressBar } from "./ProgressBar";

interface QuestionCardProps {
  index: number;
  total: number;
  question: string;
  answer: string;
  onAnswerChange: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function QuestionCard({
  index,
  total,
  question,
  answer,
  onAnswerChange,
  onContinue,
  onBack,
}: QuestionCardProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [index]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (index === total - 1) {
        e.preventDefault();
        onContinue();
      }
    }
  };

  const numberLabel = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <motion.div
      key={`question-${index}`}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: "spring", stiffness: 450, damping: 34 }}
    >
      <div className="w-full max-w-2xl">
        <p className="font-mono text-[10px] tracking-[0.4em] text-mythos-orange mb-6">{numberLabel}</p>
        <h2 className="font-sans font-extralight text-[clamp(1.5rem,5vw,3rem)] leading-tight tracking-tight text-mythos-bone mb-10">
          {question}
        </h2>

        <div className="solid p-1 mb-8">
          <textarea
            ref={textareaRef}
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={6}
            className="w-full bg-canvas text-mythos-bone p-5 font-sans font-light text-base resize-none outline-none placeholder:text-ink-3"
            placeholder="Speak plainly. The engine listens."
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            disabled={index === 0}
            className="font-mono text-[10px] tracking-[0.25em] text-mythos-bone/40 hover:text-mythos-bone disabled:opacity-20 disabled:hover:text-mythos-bone/40 transition-colors"
          >
            BACK
          </button>

          <ProgressBar total={total} current={index + 1} />

          <button
            onClick={onContinue}
            className="solid-orange px-6 py-3 font-mono text-[10px] tracking-[0.25em] text-mythos-orange hover:bg-mythos-orange/10 active:scale-[0.98] transition-colors"
          >
            CONTINUE
          </button>
        </div>

        {index === total - 1 && (
          <p className="mt-4 font-mono text-[10px] text-mythos-bone/30 tracking-wider text-right">
            PRESS ENTER TO COMPLETE
          </p>
        )}
      </div>
    </motion.div>
  );
}
