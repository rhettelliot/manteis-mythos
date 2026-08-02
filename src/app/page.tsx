"use client";

import { useEffect, useMemo, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Gate } from "@/components/Gate";
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

  const [phase, setPhase] = useState<Phase>("gate");
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

  const enterQuestions = useCallback(() => {
    setPhase("questions");
    setQuestionIndex(0);
  }, []);

  const resumeMythos = useCallback(() => {
    if (saved) {
      setMythos(saved.mythos);
      setAnswers(saved.answers);
      updateUrl(saved.seed, saved.answers);
      setPhase("mythos");
    }
  }, [saved, updateUrl]);

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
      case "gate":
        return <Gate onEnter={enterQuestions} onResume={saved ? resumeMythos : undefined} />;
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
    saved,
    enterQuestions,
    resumeMythos,
    handleAnswerChange,
    handleContinue,
    handleBack,
    handleReset,
  ]);

  if (!isHydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black">
        <div className="font-mono text-[10px] tracking-[0.3em] text-mythos-orange animate-pulse-slow">
          INITIALIZING MYTHOS ENGINE
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-mythos-bone relative overflow-x-hidden">
      <div className="fixed inset-0 scanlines pointer-events-none z-50" />
      <AnimatePresence mode="wait" initial={false}>
        {content}
      </AnimatePresence>
    </main>
  );
}

export default function MythosPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-black">
          <div className="font-mono text-[10px] tracking-[0.3em] text-mythos-orange animate-pulse-slow">
            INITIALIZING MYTHOS ENGINE
          </div>
        </main>
      }
    >
      <MythosInner />
    </Suspense>
  );
}
