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
    </nav>
  )
}
