'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { DEITIES, Deity, generatePantheonReading, PantheonResult } from '@/lib/pantheonData';
import Sigil from '@/components/Sigil';

const MAX_SELECTION = 6;
const TRADITIONS = Array.from(new Set(DEITIES.map((d) => d.tradition)));

function groupByTradition(deities: Deity[]) {
  return TRADITIONS.map((tradition) => ({
    tradition,
    deities: deities.filter((d) => d.tradition === tradition),
  }));
}

function colorForTradition(tradition: string): string {
  switch (tradition) {
    case 'Greek':
      return '#007AFF';
    case 'Norse':
      return '#9CA3AF';
    case 'Egyptian':
      return '#FF4D00';
    case 'Shinto':
      return '#00D455';
    case 'Celtic':
      return '#00D455';
    case 'Hindu':
      return '#FF4D00';
    case 'Sumerian':
      return '#007AFF';
    default:
      return '#FFFFFF';
  }
}

export default function PantheonBuilder() {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<PantheonResult | null>(null);
  const [activeTradition, setActiveTradition] = useState<string | 'all'>('all');

  const filteredDeities = useMemo(() => {
    if (activeTradition === 'all') return DEITIES;
    return DEITIES.filter((d) => d.tradition === activeTradition);
  }, [activeTradition]);

  const grouped = useMemo(() => groupByTradition(filteredDeities), [filteredDeities]);

  const toggleDeity = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_SELECTION) return prev;
      return [...prev, id];
    });
  };

  const generate = () => {
    const chosen = DEITIES.filter((d) => selected.includes(d.id));
    setResult(generatePantheonReading(chosen));
  };

  const reset = () => {
    setSelected([]);
    setResult(null);
    setActiveTradition('all');
  };

  useEffect(() => {
    const saved = localStorage.getItem('mythos-pantheon');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as PantheonResult;
        if (parsed?.deities?.length) {
          setResult(parsed);
          setSelected(parsed.deities.map((d) => d.id));
        }
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (result) {
      localStorage.setItem('mythos-pantheon', JSON.stringify(result));
    }
  }, [result]);

  if (result) {
    return <PantheonResultView result={result} onReset={reset} />;
  }

  return (
    <section className="relative min-h-screen w-full bg-black px-6 py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-[#FF4D00] mb-2">Pantheon Builder</p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-white">
            Assemble Your Court
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">
            Choose up to six archetypal forces from different mythological traditions. Their domains,
            elements, and alignments will compose a personalized mythos reading.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex flex-wrap items-center gap-3 mb-10"
        >
          <button
            onClick={() => setActiveTradition('all')}
            className={`px-4 py-2 text-xs tracking-[0.2em] uppercase border rounded-none transition ${
              activeTradition === 'all'
                ? 'bg-[#FF4D00] border-[#FF4D00] text-black'
                : 'border-white/20 text-white/60 hover:border-[#FF4D00] hover:text-[#FF4D00] bg-transparent'
            }`}
          >
            All
          </button>
          {TRADITIONS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTradition(t)}
              className={`px-4 py-2 text-xs tracking-[0.2em] uppercase border rounded-none transition ${
                activeTradition === t
                  ? 'bg-[#007AFF] border-[#007AFF] text-white'
                  : 'border-white/20 text-white/60 hover:border-[#007AFF] hover:text-[#007AFF] bg-transparent'
              }`}
            >
              {t}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {grouped.map((group) => (
              <motion.div
                key={group.tradition}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {activeTradition === 'all' && (
                  <div
                    className="text-xs tracking-[0.3em] uppercase font-medium"
                    style={{ color: colorForTradition(group.tradition) }}
                  >
                    {group.tradition}
                  </div>
                )}
                {group.deities.map((deity) => {
                  const isSelected = selected.includes(deity.id);
                  return (
                    <motion.button
                      key={deity.id}
                      layout
                      onClick={() => toggleDeity(deity.id)}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left border p-5 rounded-none transition bg-transparent ${
                        isSelected
                          ? 'border-[#00D455]'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-xl font-light tracking-tight text-white">{deity.name}</h3>
                        <div
                          className={`w-3 h-3 border rounded-none ${
                            isSelected ? 'bg-[#00D455] border-[#00D455]' : 'border-white/30'
                          }`}
                        />
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 text-[10px] tracking-wider uppercase border border-white/10 text-white/50">
                          {deity.domain}
                        </span>
                        <span className="px-2 py-1 text-[10px] tracking-wider uppercase border border-white/10 text-white/50">
                          {deity.element}
                        </span>
                        <span className="px-2 py-1 text-[10px] tracking-wider uppercase border border-white/10 text-white/50">
                          {deity.alignment}
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed text-white/40 mb-3">{deity.archetype}</p>
                      <p className="text-xs leading-relaxed text-white/60">{deity.description}</p>

                      <p className="mt-4 text-[10px] tracking-[0.2em] uppercase text-white/30">
                        Symbol: {deity.symbol}
                      </p>
                    </motion.button>
                  );
                })}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/95 backdrop-blur-none px-6 py-4"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="text-xs tracking-[0.2em] uppercase text-white/50">
              Selected: {selected.length} / {MAX_SELECTION}
            </div>
            <button
              onClick={generate}
              disabled={selected.length === 0}
              className="border-2 border-[#FF4D00] bg-transparent text-[#FF4D00] px-8 py-3 text-xs tracking-[0.25em] uppercase hover:bg-[#FF4D00] hover:text-black transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#FF4D00] rounded-none"
            >
              Weave Pantheon
            </button>
          </div>
        </motion.div>

        <div className="h-24" />
      </div>
    </section>
  );
}

function PantheonResultView({ result, onReset }: { result: PantheonResult; onReset: () => void }) {
  return (
    <div className="min-h-screen bg-black px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-[0.4em] uppercase text-[#FF4D00] mb-2"
        >
          Your Pantheon
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl font-light tracking-tighter text-white mb-10"
        >
          {result.deities.map((d) => d.name).join(' · ')}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <Sigil seed={result.seed} size={260} />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {result.deities.map((deity, i) => (
            <motion.div
              key={deity.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.08 }}
              className="border border-white/10 p-5 rounded-none"
            >
              <p
                className="text-[10px] tracking-[0.3em] uppercase mb-2"
                style={{ color: colorForTradition(deity.tradition) }}
              >
                {deity.tradition}
              </p>
              <h3 className="text-lg font-light tracking-tight text-white mb-1">{deity.name}</h3>
              <p className="text-xs text-white/40 mb-3">
                {deity.archetype} · {deity.domain} · {deity.element} · {deity.alignment}
              </p>
              <p className="text-xs leading-relaxed text-white/60">{deity.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="border border-white/10 p-8 mb-10 rounded-none"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-[#007AFF] mb-4">Mythos Reading</p>
          <div className="text-base md:text-lg leading-relaxed text-white/90 whitespace-pre-line font-light">
            {result.reading}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center"
        >
          <button
            onClick={onReset}
            className="border border-white/20 text-white/80 px-8 py-3 text-xs tracking-[0.25em] uppercase hover:border-[#FF4D00] hover:text-[#FF4D00] transition rounded-none bg-transparent"
          >
            Build Another Pantheon
          </button>
        </motion.div>
      </div>
    </div>
  );
}
