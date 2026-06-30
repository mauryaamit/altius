import React from 'react'

interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Stroke 1 (left, shortest): ink-faint (#9B9282), 6px round-cap */}
      <line
        x1="50"
        y1="85"
        x2="24.2"
        y2="48.1"
        stroke="#9B9282"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Stroke 3 (right, medium): ink (#1F1B16), 6px round-cap */}
      <line
        x1="50"
        y1="85"
        x2="83.3"
        y2="37.5"
        stroke="#1F1B16"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Stroke 2 (center, tallest): accent ink-blue (#1E3A5F), 7px round-cap */}
      <line
        x1="50"
        y1="85"
        x2="50"
        y2="15"
        stroke="#1E3A5F"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Base point: single dot, ink color (#1F1B16) */}
      <circle cx="50" cy="85" r="4.5" fill="#1F1B16" />
    </svg>
  )
}
