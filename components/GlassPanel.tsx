'use client'

import { ReactNode } from 'react'

interface GlassPanelProps {
  children: ReactNode
  className?: string
}

export default function GlassPanel({ children, className = '' }: GlassPanelProps) {
  return (
    <div className={`bg-white/[0.03] backdrop-blur-xl border border-white/[0.1] p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  )
}
