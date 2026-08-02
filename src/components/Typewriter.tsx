"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  active?: boolean;
}

export function Typewriter({ text, speed = 20, onComplete, className = "", active = true }: TypewriterProps) {
  const [visible, setVisible] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setVisible(0);
    setDone(false);
  }, [text]);

  useEffect(() => {
    if (!active) return;
    if (visible < text.length) {
      const timer = setTimeout(() => {
        setVisible((v) => Math.min(v + 1, text.length));
      }, speed);
      return () => clearTimeout(timer);
    }
    if (!done && visible === text.length) {
      setDone(true);
      onComplete?.();
    }
  }, [visible, text.length, speed, done, onComplete, active]);

  if (!active) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {text.slice(0, visible)}
      {!done && (
        <span className="inline-block w-[0.6em] h-[1em] bg-mythos-orange align-middle ml-[2px] animate-flicker" />
      )}
    </span>
  );
}
