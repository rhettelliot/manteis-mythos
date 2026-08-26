'use client'

import { ReactNode } from 'react'

interface GlassPanelProps {
  children: ReactNode
  className?: string
}

export default function GlassPanel({ children, className = '' }: GlassPanelProps) {
  return (
    <div className={`bg-surface border border-border p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  )
}
