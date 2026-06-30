'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, HelpCircle, TrendingUp, X } from 'lucide-react'

export function OnboardingOverlay() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Check if user has already dismissed it
    const onboarded = localStorage.getItem('altius-onboarded-v1')
    if (!onboarded) {
      // Show with a slight delay for better UX
      const timer = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem('altius-onboarded-v1', 'true')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="onboard-scrim"
            onClick={handleDismiss}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="onboard-modal font-body"
          >
            <div className="onboard-header">
              <h2 className="font-display text-h2 text-mba-ink">Welcome to Altius</h2>
              <button onClick={handleDismiss} className="close-btn" aria-label="Dismiss onboarding">
                <X size={20} />
              </button>
            </div>

            <p className="onboard-intro text-body text-mba-ink-soft mb-6">
              Your daily knowledge ritual optimized for elite MBA-level competence. Here is how it works:
            </p>

            <div className="onboard-cards">
              <div className="onboard-card">
                <div className="icon-wrap text-mba-accent">
                  <BookOpen size={20} />
                </div>
                <div className="card-content">
                  <h3 className="font-display font-bold text-mba-ink mb-1">Daily Ritual</h3>
                  <p className="text-caption text-mba-ink-soft">
                    Each day brings fresh Cases, Hot Topics, and Think questions across 6 core specializations.
                  </p>
                </div>
              </div>

              <div className="onboard-card">
                <div className="icon-wrap text-mba-accent">
                  <HelpCircle size={20} />
                </div>
                <div className="card-content">
                  <h3 className="font-display font-bold text-mba-ink mb-1">Depth Altitudes</h3>
                  <p className="text-caption text-mba-ink-soft">
                    Explore key business frameworks. Read the hook, understand the plain summary, or expand the deep analysis.
                  </p>
                </div>
              </div>

              <div className="onboard-card">
                <div className="icon-wrap text-mba-accent">
                  <TrendingUp size={20} />
                </div>
                <div className="card-content">
                  <h3 className="font-display font-bold text-mba-ink mb-1">Track Progress</h3>
                  <p className="text-caption text-mba-ink-soft">
                    Mark items as Recalled to feed the spaced-repetition scheduler. Track your streaks and metrics in real-time.
                  </p>
                </div>
              </div>
            </div>

            <button onClick={handleDismiss} className="get-started-btn font-mono text-mono-label mt-6">
              Start Daily Ritual
            </button>
          </motion.div>

          <style jsx>{`
            .onboard-scrim {
              position: fixed;
              top: 0;
              left: 0;
              width: 100vw;
              height: 100vh;
              background: rgba(31, 27, 22, 0.5);
              z-index: 90;
              backdrop-filter: blur(1px);
            }

            .onboard-modal {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 90%;
              max-width: 520px;
              background: var(--mba-bg);
              border: 1px solid var(--mba-rule);
              border-radius: var(--radius-md);
              padding: var(--space-6);
              z-index: 100;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            }

            .onboard-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: var(--space-3);
            }

            .close-btn {
              background: none;
              border: none;
              color: var(--mba-ink-faint);
              cursor: pointer;
              padding: 4px;
            }

            .onboard-intro {
              margin: 0;
            }

            .onboard-cards {
              display: flex;
              flex-direction: column;
              gap: var(--space-4);
            }

            .onboard-card {
              display: flex;
              gap: var(--space-4);
              background: var(--mba-surface);
              border: 1px solid var(--mba-rule);
              border-radius: var(--radius-sm);
              padding: var(--space-4);
              align-items: flex-start;
            }

            .icon-wrap {
              flex-shrink: 0;
              background: var(--mba-accent-soft);
              width: 36px;
              height: 36px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .card-content {
              display: flex;
              flex-direction: column;
            }

            .card-content h3 {
              line-height: 1.2;
            }

            .card-content p {
              margin: 0;
            }

            .get-started-btn {
              width: 100%;
              background: var(--mba-accent);
              color: #ffffff;
              border: none;
              padding: var(--space-3);
              border-radius: var(--radius-sm);
              cursor: pointer;
              text-align: center;
            }

            .get-started-btn:hover {
              opacity: 0.95;
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  )
}
