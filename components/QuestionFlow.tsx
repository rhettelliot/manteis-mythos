"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const QUESTIONS = [
  "What is the earliest memory that shaped you?",
  "What do you fear most about yourself?",
  "What do you love most fiercely?",
  "What would you die for?",
  "What pattern keeps repeating in your life?",
  "If you could speak to your 10-year-old self, what would you say?",
  "What is the question you are afraid to answer?",
];

export default function QuestionFlow({ onComplete }: { onComplete: (answers: string[]) => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(QUESTIONS.length).fill(""));
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(answers[index] || "");
    const timer = setTimeout(() => textareaRef.current?.focus(), 120);
    return () => clearTimeout(timer);
  }, [index]);

  const progress = ((index + 1) / QUESTIONS.length) * 100;
  const isLast = index === QUESTIONS.length - 1;

  const saveCurrent = (value: string) => {
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
  };

  const handleForward = () => {
    saveCurrent(text);
    if (isLast) {
      onComplete(
        answers.map((a, i) => (i === index ? text : a))
      );
    } else {
      setIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    saveCurrent(text);
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black px-6 py-16 overflow-hidden">
      <div
        className="fixed top-0 left-0 h-[1px] z-50"
        style={{ width: `${progress}%`, backgroundColor: "#FF4D00" }}
      />

      <div className="fixed top-6 right-6 z-50 text-xs tracking-[0.3em] text-white/40 uppercase">
        {String(index + 1).padStart(2, "0")} / {String(QUESTIONS.length).padStart(2, "0")}
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white text-center max-w-2xl mb-10">
              {QUESTIONS[index]}
            </h1>

            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Speak plainly. The engine listens for the shape beneath the words."
              className="w-full max-w-xl min-h-[120px] bg-white/5 border border-white/10 backdrop-blur-xl p-4 text-white placeholder-white/30 focus:border-[#FF4D00] outline-none resize-none font-sans text-base rounded-none"
              spellCheck={false}
            />

            <p className="mt-4 text-xs tracking-widest text-white/30 uppercase">
              Press Continue when ready.
            </p>

            <div className="w-full max-w-xl flex items-center justify-between mt-10">
              <button
                onClick={handleBack}
                disabled={index === 0}
                className="text-white/50 hover:text-white text-xs tracking-[0.2em] uppercase transition disabled:opacity-25 disabled:hover:text-white/50 rounded-none bg-transparent"
              >
                Back
              </button>

              <button
                onClick={handleForward}
                className="border border-[#FF4D00] text-[#FF4D00] px-8 py-3 text-xs tracking-[0.25em] uppercase hover:bg-[#FF4D00] hover:text-black transition rounded-none"
              >
                {isLast ? "Reveal" : "Continue"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
