'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export interface TabDef {
  id: string
  label: string
  icon?: React.ReactNode
}

interface TabBarProps {
  tabs: TabDef[]
  activeTab: string
  onTabChange?: (id: string) => void
  queryParam?: string
}

export function TabBar({ tabs, activeTab, onTabChange, queryParam = 'tab' }: TabBarProps) {
  const pathname = usePathname()

  return (
    <nav className="tab-bar" role="tablist" aria-label="Page sections">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        const href = `${pathname}?${queryParam}=${tab.id}`

        return (
          <Link
            key={tab.id}
            href={href}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange?.(tab.id)}
            className={`tab-item ${isActive ? 'tab-item--active' : ''}`}
            replace  // don't push tab switches to history stack
          >
            {tab.icon && (
              <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
            )}
            <span className="tab-label font-mono text-mono-label uppercase tracking-widest">
              {tab.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="activeTabUnderline"
                className="active-underline"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
          </Link>
        )
      })}

      <style jsx>{`
        .tab-bar {
          display: flex;
          gap: 0;
          border-bottom: 1px solid var(--mba-rule);
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
          position: sticky;
          top: 0;
          z-index: 30;
          background: var(--mba-bg);
          padding: 0 var(--space-1);
        }
        .tab-bar::-webkit-scrollbar { display: none; }

        @media (max-width: 767px) {
          .tab-bar {
            top: 56px;
          }
        }

        .tab-item {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: 10px 16px;
          text-decoration: none;
          color: var(--mba-ink-faint);
          margin-bottom: -1px;
          white-space: nowrap;
          flex-shrink: 0;
          position: relative;
          border-radius: 4px 4px 0 0;
          transition: color 120ms ease, background-color 120ms ease;
          background-color: transparent;
        }

        /* Hover — visible tint */
        .tab-item:hover {
          color: var(--mba-ink);
          background-color: rgba(30, 58, 95, 0.08);
        }

        /* Active — strong accent */
        .tab-item--active {
          color: #1E3A5F !important;
          background-color: rgba(30, 58, 95, 0.10);
          font-weight: 700;
        }

        .tab-item--active .tab-label {
          color: #1E3A5F;
        }

        .active-underline {
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: #1E3A5F;
          border-radius: 2px 2px 0 0;
        }

        .tab-icon {
          display: flex;
          align-items: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .tab-item { transition: none; }
        }
      `}</style>
    </nav>
  )
}
