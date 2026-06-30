import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { TrendDirection } from '@/lib/content/types'

interface TrendArrowProps {
  direction: TrendDirection
  label?: string  // screen-reader label
}

// Always ink-soft — never red/green to avoid implying good/bad on neutral data
export function TrendArrow({ direction, label }: TrendArrowProps) {
  const Icon =
    direction === 'up'   ? TrendingUp   :
    direction === 'down' ? TrendingDown :
    Minus

  const ariaLabel = label || (
    direction === 'up'   ? 'Increasing' :
    direction === 'down' ? 'Decreasing' :
    'Stable'
  )

  return (
    <span
      className="trend-arrow"
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <Icon size={14} strokeWidth={2} />
      <style jsx>{`
        .trend-arrow {
          display: inline-flex;
          align-items: center;
          color: var(--mba-ink-soft);
          vertical-align: middle;
        }
      `}</style>
    </span>
  )
}
