"use client";

interface ProgressBarProps {
  total: number;
  current: number;
}

export function ProgressBar({ total, current }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-1 w-full max-w-md" aria-label="Question progress">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 transition-all duration-500 ${
            i < current ? "bg-mythos-orange" : "progress-incomplete"
          }`}
        />
      ))}
    </div>
  );
}
