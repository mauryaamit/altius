'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X, Home, Activity, Calculator, BookOpen, User, Settings, Shield } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { useMbaStore } from '@/lib/stores/mbaStore'

interface AltiusShellProps {
  children: React.ReactNode
}

interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
}

const dailyItems: NavItem[] = [
  { label: 'Marketing',   href: '/marketing' },
  { label: 'Finance',     href: '/finance' },
  { label: 'Consulting',  href: '/consulting' },
  { label: 'Operations',  href: '/operations' },
  { label: 'Strategy',    href: '/strategy' },
  { label: 'People',      href: '/people' },
  { label: 'Companies',   href: '/companies' },
  { label: 'Roles',       href: '/roles' },
  { label: 'Guesstimate', href: '/guesstimate' },
  { label: 'GD Arena',    href: '/gd' },
  { label: 'Pulse',       href: '/pulse' },
  { label: 'Newspaper',   href: '/newspaper' },
  { label: 'Bites',       href: '/bites' },
]

const referenceItems: NavItem[] = [
  { label: 'English',     href: '/english' },
  { label: 'Interview',   href: '/interview' },
  { label: 'India Facts', href: '/india-facts' },
  { label: 'Library',     href: '/library' },
]

const youItems: NavItem[] = [
  { label: 'Favorites',  href: '/favorites' },
  { label: 'Notes',      href: '/notes' },
  { label: 'Journal',    href: '/journal' },
  { label: 'Progress',   href: '/progress' },
  { label: 'Settings',   href: '/settings' },
]

// Bottom navigation items on mobile (<768px)
const bottomNavItems = [
  { label: 'Home', href: '/', icon: <Home size={20} /> },
  { label: 'Pulse', href: '/pulse', icon: <Activity size={20} /> },
  { label: 'Guesstimate', href: '/guesstimate', icon: <Calculator size={20} /> },
  { label: 'Library', href: '/library', icon: <BookOpen size={20} /> },
]

export function AltiusShell({ children }: AltiusShellProps) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Auto-close drawer on route change
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  // Load and apply reading text scale
  const textSize = useMbaStore((state) => state.textSize) || 'default'
  useEffect(() => {
    const scaleMap = { compact: '0.9', default: '1.0', large: '1.15' }
    const scaleVal = scaleMap[textSize] || '1.0'
    document.documentElement.style.setProperty('--reading-scale', scaleVal)
  }, [textSize])

  // Trap focus inside drawer when open
  useEffect(() => {
    if (!drawerOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !drawerRef.current) return

      const focusableElements = drawerRef.current.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [drawerOpen])

  // Return focus to hamburger when drawer closes
  useEffect(() => {
    if (!drawerOpen && hamburgerRef.current) {
      hamburgerRef.current.focus()
    }
  }, [drawerOpen])

  const renderLink = (item: NavItem, onClickLink?: () => void) => {
    const isActive =
      item.href === '/'
        ? pathname === '/'
        : pathname === item.href || pathname.startsWith(item.href + '/')

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClickLink}
        className={`altius-nav-link font-body text-caption ${isActive ? 'active' : ''}`}
      >
        {item.label}
      </Link>
    )
  }

  const renderNavContent = (onClickLink?: () => void) => (
    <div className="nav-wrapper">
      {renderLink({ label: 'Home', href: '/' }, onClickLink)}

      {/* DAILY group */}
      <div className="nav-group">
        <div className="nav-group-divider"></div>
        <span className="nav-group-label font-mono text-mono-label">Daily</span>
        <div className="nav-group-items">
          {dailyItems.map((item) => renderLink(item, onClickLink))}
        </div>
      </div>

      {/* REFERENCE group */}
      <div className="nav-group">
        <div className="nav-group-divider"></div>
        <span className="nav-group-label font-mono text-mono-label">Reference</span>
        <div className="nav-group-items">
          {referenceItems.map((item) => renderLink(item, onClickLink))}
        </div>
      </div>

      {/* YOU group */}
      <div className="nav-group">
        <div className="nav-group-divider"></div>
        <span className="nav-group-label font-mono text-mono-label">You</span>
        <div className="nav-group-items">
          {youItems.map((item) => renderLink(item, onClickLink))}
        </div>
      </div>
    </div>
  )



  return (
    <div className="altius-shell">
      {/* 1. DESKTOP SIDEBAR (Visible >= 768px) */}
      <aside className="altius-sidebar md-sidebar" aria-label="Altius navigation">
        <div className="altius-sidebar-header">
          <Link href="/" className="altius-wordmark">
            <div className="altius-logo-row">
              <Logo size={28} />
              <span className="font-display text-h2 text-mba-ink altius-brand-name">Altius</span>
            </div>
            <span className="altius-tagline font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">
              Think at every altitude
            </span>
          </Link>
        </div>

        {/* Scrollable Nav Area */}
        <nav className="altius-nav scrollable-nav">
          {renderNavContent()}
        </nav>

      </aside>

      {/* 2. MOBILE HEADER & BOTTOM TAB BAR (Visible < 768px) */}
      <header
        className={`altius-mobile-top-bar ${drawerOpen ? 'drawer-is-open' : ''}`}
        aria-label="Mobile header"
        aria-hidden={drawerOpen ? "true" : undefined}
        style={drawerOpen ? { pointerEvents: 'none', opacity: 0.3 } : undefined}
      >
        <button
          ref={hamburgerRef}
          onClick={() => setDrawerOpen(true)}
          className="hamburger-btn"
          aria-label="Open navigation menu"
          aria-expanded={drawerOpen}
        >
          <Menu size={24} />
        </button>
        <Link href="/" className="mobile-logo-wrap" aria-label="Home page">
          <Logo size={28} />
        </Link>
        <div className="header-right-placeholder"></div>
      </header>

      {/* MOBILE DRAWER (Animate off-canvas) */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Scrim Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              className="drawer-scrim"
            />

            {/* Left Side Drawer */}
            <motion.div
              ref={drawerRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
              className="drawer-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation drawer"
            >
              <div className="drawer-header">
                <Link href="/" className="altius-wordmark" onClick={() => setDrawerOpen(false)}>
                  <div className="altius-logo-row">
                    <Logo size={28} />
                    <span className="font-display text-h2 text-mba-ink altius-brand-name">Altius</span>
                  </div>
                </Link>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="close-drawer-btn"
                  aria-label="Close navigation menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Scrollable content */}
              <nav className="drawer-nav scrollable-nav">
                {renderNavContent(() => setDrawerOpen(false))}
              </nav>


            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. MOBILE BOTTOM TAB BAR */}
      <nav className="altius-mobile-bottom-bar" aria-label="Quick navigation">
        {bottomNavItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`bottom-nav-item font-body ${isActive ? 'active' : ''}`}
            >
              <span className="bottom-nav-icon">{item.icon}</span>
              <span className="bottom-nav-label font-mono">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Main content */}
      <main className="altius-main" id="main-content">
        {children}
      </main>

      <style jsx>{`
        .altius-shell {
          display: flex;
          min-height: 100dvh;
          background: var(--mba-bg);
        }

        /* ─── Desktop Sidebar Layout ─── */
        .altius-sidebar {
          width: 240px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--mba-rule);
          background: var(--mba-bg);
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .altius-sidebar-header {
          padding: var(--space-6) var(--space-5) var(--space-4);
          border-bottom: 1px solid var(--mba-rule);
          flex-shrink: 0;
        }

        .altius-wordmark {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          gap: var(--space-2);
        }

        .altius-logo-row {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .altius-brand-name {
          font-weight: 500;
          line-height: 1.1;
        }

        .altius-tagline {
          font-size: 9px;
          letter-spacing: 0.08em;
        }

        .scrollable-nav {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-4) var(--space-3);
          scrollbar-width: thin;
        }

        .scrollable-nav::-webkit-scrollbar {
          width: 4px;
        }
        .scrollable-nav::-webkit-scrollbar-thumb {
          background-color: var(--mba-rule);
          border-radius: 4px;
        }

        .nav-wrapper {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nav-group {
          margin-top: var(--space-5);
          display: flex;
          flex-direction: column;
        }

        .nav-group-divider {
          height: 1px;
          background-color: var(--mba-rule);
          margin-bottom: var(--space-3);
        }

        .nav-group-label {
          color: var(--mba-ink-faint);
          padding: 0 var(--space-3);
          margin-bottom: var(--space-2);
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .nav-group-items {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        :global(.altius-nav-link) {
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-sm);
          text-decoration: none;
          color: var(--mba-ink-soft);
          transition: background 150ms ease, color 150ms ease;
          display: block;
        }

        :global(.altius-nav-link:hover) {
          background: var(--mba-accent-soft);
          color: var(--mba-ink);
        }

        :global(.altius-nav-link.active) {
          background: var(--mba-accent-soft);
          color: var(--mba-ink);
          font-weight: 500;
          border-left: 3px solid var(--mba-accent);
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }

        .profile-footer-wrapper {
          flex-shrink: 0;
          border-top: 1px solid var(--mba-rule);
          padding: var(--space-4) var(--space-5);
          background: var(--mba-bg);
        }

        .altius-profile-footer {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .avatar-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--mba-accent);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 13px;
        }

        .profile-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .profile-name {
          font-size: var(--text-caption);
          font-weight: 500;
          color: var(--mba-ink);
          line-height: 1.2;
          margin: 0;
        }

        .profile-role {
          font-size: 10px;
          color: var(--mba-ink-faint);
          margin: 0;
        }

        /* ─── Mobile Header ─── */
        .altius-mobile-top-bar {
          display: none;
        }

        /* ─── Mobile Bottom Tab Bar ─── */
        .altius-mobile-bottom-bar {
          display: none;
        }

        /* ─── Mobile Drawer Panel ─── */
        :global(.drawer-scrim) {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(31, 27, 22, 0.4);
          z-index: 45;
        }

        :global(.drawer-panel) {
          position: fixed;
          top: 0;
          left: 0;
          width: min(85%, 320px);
          height: 100vh;
          background: var(--mba-bg);
          z-index: 50;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 16px rgba(0, 0, 0, 0.1);
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-4) var(--space-3);
          border-bottom: 1px solid var(--mba-rule);
        }

        .close-drawer-btn {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: var(--mba-ink-soft);
          cursor: pointer;
        }

        .drawer-nav {
          flex: 1;
        }

        /* ─── Main Content ─── */
        .altius-main {
          flex: 1;
          min-width: 0;
          max-width: 860px;
          padding: var(--space-7) var(--space-6);
        }

        /* ─── Media Query Swaps (< 768px) ─── */
        @media (max-width: 767px) {
          .altius-shell {
            flex-direction: column;
          }

          .altius-sidebar {
            display: none;
          }

          .altius-mobile-top-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 40;
            background: var(--mba-bg);
            border-bottom: 1px solid var(--mba-rule);
            height: 56px;
            padding: 0 var(--space-3);
          }

          .hamburger-btn {
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            color: var(--mba-ink);
            cursor: pointer;
          }

          .mobile-logo-wrap {
            display: flex;
            align-items: center;
          }

          .header-right-placeholder {
            width: 44px; /* balance the hamburger */
          }

          .altius-mobile-bottom-bar {
            display: flex;
            justify-content: space-around;
            align-items: center;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100vw;
            height: 64px;
            background: var(--mba-bg);
            border-top: 1px solid var(--mba-rule);
            z-index: 40;
            padding-bottom: env(safe-area-inset-bottom);
          }

          .bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            color: var(--mba-ink-faint);
            flex: 1;
            height: 100%;
            transition: color 150ms ease;
            position: relative;
          }

          .bottom-nav-icon {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .bottom-nav-label {
            font-size: 10px;
            margin-top: 2px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .bottom-nav-item.active {
            color: var(--mba-accent);
          }

          .bottom-nav-item.active::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background-color: var(--mba-accent);
          }

          .altius-main {
            padding: var(--space-5) var(--space-4) calc(64px + var(--space-5) + env(safe-area-inset-bottom));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(.altius-nav-link) { transition: none; }
          .bottom-nav-item { transition: none; }
        }
      `}</style>
    </div>
  )
}
