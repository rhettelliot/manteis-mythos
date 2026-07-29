'use client'

import { useState, useEffect, useRef } from 'react'

interface TypewriterProps {
  text: string
  speed?: number
  onComplete?: () => void
}

export default function Typewriter({ text, speed = 15, onComplete }: TypewriterProps) {
  const [displayText, setDisplayText] = useState('')
  const hasCompletedRef = useRef(false)

  useEffect(() => {
    setDisplayText('')
    hasCompletedRef.current = false
  }, [text])

  useEffect(() => {
    if (!text) {
      if (onComplete && !hasCompletedRef.current) {
        hasCompletedRef.current = true
        onComplete()
      }
      return
    }

    const interval = setInterval(() => {
      setDisplayText((prev) => {
        if (prev.length >= text.length) {
          clearInterval(interval)
          if (onComplete && !hasCompletedRef.current) {
            hasCompletedRef.current = true
            onComplete()
          }
          return prev
        }
        return text.slice(0, prev.length + 1)
      })
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <span className="whitespace-pre-wrap">
      {displayText}
      <span className="inline-block w-[0.6em] h-[1em] bg-orange ml-1 animate-pulse align-middle" />
    </span>
  )
}
