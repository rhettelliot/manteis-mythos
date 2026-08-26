'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { decodeShareURL } from '@/lib/share';
import { generateMythos } from '@/lib/mythos';
import MythosDisplay from '@/components/MythosDisplay';
import type { MythosData } from '@/lib/types';

function ShareContent() {
  const router = useRouter();
  const [mythos, setMythos] = useState<MythosData | null>(null);
  const [answers, setAnswers] = useState<string[] | null>(null);
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    const shared = decodeShareURL(hash);

    if (shared && shared.length > 0) {
      const data = generateMythos(shared);
      setAnswers(shared);
      setMythos(data);
    } else {
      setIsInvalid(true);
    }
  }, []);

  if (mythos && answers) {
    return (
      <MythosDisplay
        mythos={mythos}
        answers={answers}
        onReset={() => router.push('/')}
      />
    );
  }

  if (isInvalid) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-canvas text-ink px-6">
        <div className="max-w-md border border-border bg-surface  p-10 text-center">
          <h1 className="text-2xl font-medium tracking-tight mb-4">
            No mythos found.
          </h1>
          <p className="text-ink-2 text-sm mb-8">
            The shared link appears to be missing or invalid.
          </p>
          <Link
            href="/"
            className="inline-block border-2 border-orange px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-orange hover:bg-orange hover:text-canvas transition"
          >
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  return null;
}

export default function SharePage() {
  return (
    <Suspense fallback={null}>
      <ShareContent />
    </Suspense>
  );
}
