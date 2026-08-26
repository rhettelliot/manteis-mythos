'use client'

import type { SigilData } from '@/lib/types'

interface SigilProps {
  sigil: SigilData
}

export default function Sigil({ sigil }: SigilProps) {
  const { vertices, connections, innerRadius, outerRadius, symbolType } = sigil

  const renderSymbol = () => {
    switch (symbolType) {
      case 0:
        return <polygon points="0,-40 35,20 -35,20" fill="none" stroke="#FF4D00" strokeWidth="1" />
      case 1:
        return <rect x="-30" y="-30" width="60" height="60" fill="none" stroke="#FF4D00" strokeWidth="1" />
      case 2:
        return (
          <polygon
            points="0,-40 35,-20 35,20 0,40 -35,20 -35,-20"
            fill="none"
            stroke="#FF4D00"
            strokeWidth="1"
          />
        )
      case 3:
        return (
          <>
            <ellipse cx="0" cy="0" rx="35" ry="20" fill="none" stroke="#FF4D00" strokeWidth="1" />
            <circle cx="0" cy="0" r="8" fill="#FF4D00" />
          </>
        )
      case 4:
        return (
          <path
            d="M 5 5 C 25 5, 40 20, 40 40 C 40 65, 20 80, 0 80 C -25 80, -45 60, -45 35 C -45 5, -20 -20, 10 -20 C 35 -20, 50 -5, 50 15"
            fill="none"
            stroke="#FF4D00"
            strokeWidth="1"
          />
        )
      case 5:
        return (
          <>
            <line x1="-30" y1="0" x2="30" y2="0" stroke="#FF4D00" strokeWidth="1" />
            <line x1="0" y1="-30" x2="0" y2="30" stroke="#FF4D00" strokeWidth="1" />
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] animate-slow-rotate">
      <svg
        viewBox="-150 -150 300 300"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 0 18px rgba(255,77,0,0.25))' }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="-150" y="-150" width="300" height="300" fill="#0D0F12" />

        <circle
          cx="0"
          cy="0"
          r={outerRadius}
          fill="none"
          stroke="#FF5500"
          strokeWidth="0.5"
          opacity="0.3"
        />
        <circle
          cx="0"
          cy="0"
          r={innerRadius}
          fill="none"
          stroke="#FF5500"
          strokeWidth="0.5"
          opacity="0.4"
        />

        <g>
          {connections.map(([a, b], index) => {
            const v1 = vertices[a]
            const v2 = vertices[b]
            if (!v1 || !v2) return null
            return (
              <line
                key={`conn-${index}`}
                x1={v1.x}
                y1={v1.y}
                x2={v2.x}
                y2={v2.y}
                stroke="#FF4D00"
                strokeWidth="0.8"
                opacity="0.6"
              />
            )
          })}
        </g>

        <g>
          {vertices.map((v, index) => (
            <circle
              key={`vert-${index}`}
              cx={v.x}
              cy={v.y}
              r="3"
              fill="#FF4D00"
            />
          ))}
        </g>

        <g filter="url(#glow)">{renderSymbol()}</g>
      </svg>
    </div>
  )
}
