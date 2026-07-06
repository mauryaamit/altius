'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, HelpCircle, TrendingUp, X, ChevronRight, Check } from 'lucide-react'
import { useMbaStore } from '@/lib/stores/mbaStore'

const SECTORS = [
  { id: 'Consulting', label: 'Consulting' },
  { id: 'FMCG', label: 'FMCG & Retail' },
  { id: 'Finance', label: 'Finance & Banking' },
  { id: 'Tech', label: 'Technology' },
  { id: 'Conglomerates', label: 'Conglomerates' },
  { id: 'GenMan', label: 'General Management' },
  { id: 'Healthcare', label: 'Healthcare & Pharma' },
  { id: 'Manufacturing', label: 'Manufacturing' }
]

const BACKGROUNDS = [
  { id: 'Engineering', label: 'Engineering' },
  { id: 'Commerce', label: 'Commerce / Finance' },
  { id: 'Science', label: 'Science' },
  { id: 'Arts', label: 'Arts' },
  { id: 'Other', label: 'Other' }
]

export function OnboardingOverlay() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0) // 0: Welcome, 1: MBA Year, 2: Sectors, 3: Background
  
  // Store actions
  const saveUserPrefs = useMbaStore((state) => state.saveUserPrefs)

  // Selection states
  const [mbaYear, setMbaYear] = useState<'year-1' | 'year-2' | 'other' | undefined>(undefined)
  const [targetSectors, setTargetSectors] = useState<string[]>([])
  const [background, setBackground] = useState<string | undefined>(undefined)

  useEffect(() => {
    // Check if user has already dismissed it
    const onboarded = localStorage.getItem('altius-onboarded-v1')
    if (!onboarded) {
      const timer = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleSectorToggle = (sectorId: string) => {
    setTargetSectors((prev) => {
      if (prev.includes(sectorId)) {
        return prev.filter((s) => s !== sectorId)
      }
      if (prev.length >= 3) {
        // Max 3 target sectors
        return [...prev.slice(1), sectorId]
      }
      return [...prev, sectorId]
    })
  }

  const handleFinish = async () => {
    // Save selections
    await saveUserPrefs({
      mbaYear,
      targetSectors,
      background
    })
    
    localStorage.setItem('altius-onboarded-v1', 'true')
    setVisible(false)
  }

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
              <h2 className="font-display text-h2 text-mba-ink">
                {step === 0 && 'Welcome to Altius'}
                {step === 1 && 'Select Your MBA Year'}
                {step === 2 && 'Your Target Sectors'}
                {step === 3 && 'Undergrad Background'}
              </h2>
              <button onClick={handleDismiss} className="close-btn" aria-label="Dismiss onboarding">
                <X size={20} />
              </button>
            </div>

            {/* STEP 0: Explanatory card stack */}
            {step === 0 && (
              <>
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

                <button onClick={() => setStep(1)} className="get-started-btn font-mono text-mono-label mt-6">
                  <span>Continue to Setup</span>
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            {/* STEP 1: MBA Year Selection */}
            {step === 1 && (
              <>
                <p className="onboard-intro text-body text-mba-ink-soft mb-6">
                  We customize your dashboard based on whether you are preparing for Summer Internships (SIP) or Final Placements.
                </p>

                <div className="select-options">
                  <button
                    onClick={() => setMbaYear('year-1')}
                    className={`select-card ${mbaYear === 'year-1' ? 'active' : ''}`}
                  >
                    <div className="font-display font-bold text-mba-ink mb-1 text-left text-body">MBA Year 1 (SIP Focus)</div>
                    <p className="text-caption text-mba-ink-soft text-left m-0">
                      Focuses heavily on Summer Internship timeline, basics, and initial case formats.
                    </p>
                  </button>

                  <button
                    onClick={() => setMbaYear('year-2')}
                    className={`select-card ${mbaYear === 'year-2' ? 'active' : ''}`}
                  >
                    <div className="font-display font-bold text-mba-ink mb-1 text-left text-body">MBA Year 2 (Final Placement Focus)</div>
                    <p className="text-caption text-mba-ink-soft text-left m-0">
                      Prioritizes full-length complex cases, executive summaries, and industry dynamics.
                    </p>
                  </button>

                  <button
                    onClick={() => setMbaYear('other')}
                    className={`select-card ${mbaYear === 'other' ? 'active' : ''}`}
                  >
                    <div className="font-display font-bold text-mba-ink mb-1 text-left text-body">Post-MBA / Other</div>
                    <p className="text-caption text-mba-ink-soft text-left m-0">
                      Standard core framework and MBA interview knowledge bank.
                    </p>
                  </button>
                </div>

                <div className="button-group mt-6">
                  <button onClick={handleDismiss} className="skip-btn font-mono text-mono-label">
                    Skip Setup
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!mbaYear}
                    className="get-started-btn font-mono text-mono-label"
                  >
                    <span>Next step</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </>
            )}

            {/* STEP 2: Target Sectors selection (Up to 3) */}
            {step === 2 && (
              <>
                <p className="onboard-intro text-body text-mba-ink-soft mb-6">
                  Choose up to 3 sectors you are actively targeting. This highlights relevant company tracks.
                </p>

                <div className="sectors-grid">
                  {SECTORS.map((sector) => {
                    const isSelected = targetSectors.includes(sector.id)
                    return (
                      <button
                        key={sector.id}
                        onClick={() => handleSectorToggle(sector.id)}
                        className={`sector-chip font-mono text-[12px] ${isSelected ? 'active' : ''}`}
                      >
                        {isSelected && <Check size={12} className="mr-1 inline" />}
                        {sector.label}
                      </button>
                    )
                  })}
                </div>

                <div className="button-group mt-6">
                  <button onClick={handleDismiss} className="skip-btn font-mono text-mono-label">
                    Skip Setup
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={targetSectors.length === 0}
                    className="get-started-btn font-mono text-mono-label"
                  >
                    <span>Next step</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </>
            )}

            {/* STEP 3: Undergrad Background selection */}
            {step === 3 && (
              <>
                <p className="onboard-intro text-body text-mba-ink-soft mb-6">
                  Select your background to customize case matching and role explorer fits.
                </p>

                <div className="select-options">
                  {BACKGROUNDS.map((bg) => {
                    const isSelected = background === bg.id
                    return (
                      <button
                        key={bg.id}
                        onClick={() => setBackground(bg.id)}
                        className={`select-card mini-card ${isSelected ? 'active' : ''}`}
                      >
                        <div className="font-display font-medium text-mba-ink text-left text-body">{bg.label}</div>
                      </button>
                    )
                  })}
                </div>

                <div className="button-group mt-6">
                  <button onClick={handleDismiss} className="skip-btn font-mono text-mono-label">
                    Skip Setup
                  </button>
                  <button
                    onClick={handleFinish}
                    disabled={!background}
                    className="get-started-btn font-mono text-mono-label"
                  >
                    <span>Save & Start</span>
                    <Check size={16} />
                  </button>
                </div>
              </>
            )}
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
              width: 95%;
              max-width: 480px;
              background: var(--mba-bg);
              border: 1px solid var(--mba-rule);
              border-radius: var(--radius-md);
              padding: var(--space-6);
              z-index: 100;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
              max-height: 90vh;
              overflow-y: auto;
            }

            .onboard-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: var(--space-4);
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
              line-height: var(--leading-relaxed);
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

            .select-options {
              display: flex;
              flex-direction: column;
              gap: var(--space-3);
            }

            .select-card {
              display: block;
              width: 100%;
              background: var(--mba-surface);
              border: 1px solid var(--mba-rule);
              border-radius: var(--radius-sm);
              padding: var(--space-4);
              cursor: pointer;
              transition: border-color 150ms ease, background 150ms ease;
            }

            .select-card:hover {
              background: var(--mba-surface-sunk);
            }

            .select-card.active {
              border-color: var(--mba-accent);
              background: var(--mba-accent-soft);
            }

            .select-card.mini-card {
              padding: var(--space-3) var(--space-4);
            }

            .sectors-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: var(--space-2);
            }

            .sector-chip {
              display: flex;
              align-items: center;
              justify-content: center;
              background: var(--mba-surface);
              border: 1px solid var(--mba-rule);
              border-radius: var(--radius-sm);
              padding: var(--space-3) var(--space-2);
              cursor: pointer;
              color: var(--mba-ink-soft);
              transition: all 150ms ease;
            }

            .sector-chip:hover {
              background: var(--mba-surface-sunk);
            }

            .sector-chip.active {
              border-color: var(--mba-accent);
              background: var(--mba-accent-soft);
              color: var(--mba-accent);
              font-weight: 600;
            }

            .button-group {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: var(--space-4);
            }

            .skip-btn {
              background: none;
              border: none;
              color: var(--mba-ink-faint);
              cursor: pointer;
              text-decoration: underline;
            }

            .get-started-btn {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: var(--space-2);
              background: var(--mba-accent);
              color: #ffffff;
              border: none;
              padding: var(--space-3);
              border-radius: var(--radius-sm);
              cursor: pointer;
              text-align: center;
              font-weight: 600;
            }

            .get-started-btn:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }

            .get-started-btn:hover:not(:disabled) {
              opacity: 0.95;
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  )
}
