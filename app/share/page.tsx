'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { decodeAnswers, generateMythos } from '@/lib/mythosEngine';
import MythosDisplay from '@/components/MythosDisplay';

function ShareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const data = searchParams.get('d');

  let result = null;
  let isInvalid = false;

  if (data) {
    try {
      const answers = decodeAnswers(data);
      result = generateMythos(answers);
    } catch {
      isInvalid = true;
    }
  } else {
    isInvalid = true;
  }

  if (result && !isInvalid) {
    return <MythosDisplay result={result} onRestart={() => router.push('/')} />;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="max-w-md border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center">
        <h1 className="text-2xl font-medium tracking-tight mb-4">
          No mythos found.
        </h1>
        <p className="text-white/60 text-sm mb-8">
          The shared link appears to be missing or invalid.
        </p>
        <Link
          href="/"
          className="inline-block border-2 border-orange px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-orange hover:bg-orange hover:text-black transition"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={null}>
      <ShareContent />
    </Suspense>
  );
}
