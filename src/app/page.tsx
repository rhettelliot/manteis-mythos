"use client";

import { useEffect, useMemo, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { QuestionCard } from "@/components/QuestionCard";
import { Generating } from "@/components/Generating";
import { MythosDocument } from "@/components/MythosDocument";
import {
  QUESTIONS,
  type Phase,
  type MythosData,
  generateMythos,
  saveMythos,
  loadMythos,
  answersToSeed,
  compressAnswers,
  decompressAnswers,
} from "@/lib/mythos";

function MythosInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhase] = useState<Phase>("questions");
  const [answers, setAnswers] = useState<string[]>(Array(QUESTIONS.length).fill(""));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [mythos, setMythos] = useState<MythosData | null>(null);
  const [saved, setSaved] = useState<ReturnType<typeof loadMythos>>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const loaded = loadMythos();
    setSaved(loaded);

    const seedParam = searchParams.get("s");
    const answersParam = searchParams.get("a");
    if (seedParam && answersParam) {
      const seed = parseInt(seedParam, 10);
      const decoded = decompressAnswers(answersParam);
      if (!Number.isNaN(seed) && decoded.length === QUESTIONS.length) {
        const generated = generateMythos(decoded);
        if (answersToSeed(decoded) === seed) {
          setMythos(generated);
          setAnswers(decoded);
          setPhase("mythos");
          return;
        }
      }
    }
  }, [searchParams]);

  const updateUrl = useCallback(
    (seed: number, ans: string[]) => {
      const params = new URLSearchParams();
      params.set("s", seed.toString());
      params.set("a", compressAnswers(ans));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname]
  );

  const handleAnswerChange = useCallback((value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = value;
      return next;
    });
  }, [questionIndex]);

  const handleContinue = useCallback(() => {
    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      setPhase("generating");
      const generated = generateMythos(answers);
      const seed = answersToSeed(answers);
      saveMythos(seed, answers, generated);
      setSaved({ seed, answers, mythos: generated });
      updateUrl(seed, answers);
      setTimeout(() => {
        setMythos(generated);
        setPhase("mythos");
      }, 1800);
    }
  }, [questionIndex, answers, updateUrl]);

  const handleBack = useCallback(() => {
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    }
  }, [questionIndex]);

  const handleReset = useCallback(() => {
    setAnswers(Array(QUESTIONS.length).fill(""));
    setQuestionIndex(0);
    setMythos(null);
    router.replace(pathname, { scroll: false });
    setPhase("questions");
  }, [router, pathname]);

  const content = useMemo(() => {
    switch (phase) {
      case "questions":
        return (
          <QuestionCard
            index={questionIndex}
            total={QUESTIONS.length}
            question={QUESTIONS[questionIndex] ?? ""}
            answer={answers[questionIndex] ?? ""}
            onAnswerChange={handleAnswerChange}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        );
      case "generating":
        return <Generating />;
      case "mythos":
        return mythos ? <MythosDocument mythos={mythos} onReset={handleReset} /> : <Generating />;
      default:
        return null;
    }
  }, [
    phase,
    questionIndex,
    answers,
    mythos,
    handleAnswerChange,
    handleContinue,
    handleBack,
    handleReset,
  ]);

  if (!isHydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="font-mono text-[10px] tracking-[0.3em] text-mythos-orange animate-pulse-slow">
          INITIALIZING MYTHOS ENGINE
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-canvas text-mythos-bone relative overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-white/10 bg-canvas px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="blink absolute inline-flex h-full w-full rounded-none bg-mythos-orange opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-none bg-mythos-orange" />
          </span>
          <span className="mono-data text-[10px] tracking-[0.25em] text-mythos-bone/80">MYTHOS</span>
        </div>
        <span className="mono-data text-[10px] tracking-[0.2em] text-mythos-bone/40">EGREGORE</span>
      </header>
      <div className="fixed inset-0 scanlines pointer-events-none z-50" />
      <div className="pt-14">
        <AnimatePresence mode="wait" initial={false}>
          {content}
        </AnimatePresence>
      </div>
      <footer className="border-t border-white/10 bg-canvas px-4 py-4 text-center">
        <p className="mono-data text-[10px] tracking-[0.3em] text-mythos-bone/40">
          EGREGORE — MYTHOS · SIGIL · REVERIE
        </p>
      </footer>
    </main>
  );
}

export default function MythosPage() {
  return (
    <>
      <h1 className="sr-only">MYTHOS — Personal Mythology Engine</h1>
      <Suspense
        fallback={
          <main className="min-h-screen flex items-center justify-center bg-canvas">
            <h1 className="sr-only">MYTHOS — Personal Mythology Engine</h1>
            <div className="font-mono text-[10px] tracking-[0.3em] text-mythos-orange animate-pulse-slow">
              INITIALIZING MYTHOS ENGINE
            </div>
          </main>
        }
      >
        <MythosInner />
      </Suspense>
    </>
  );
}
