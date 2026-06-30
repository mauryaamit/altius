'use client'
import React, { useState } from 'react'
import { Settings, RefreshCw, Trash2, Shield, User, HelpCircle } from 'lucide-react'

export default function SettingsPage() {
  const [resetStatus, setResetStatus] = useState('')

  const handleResetStreak = () => {
    if (confirm('Are you sure you want to reset your daily streak? This action cannot be undone.')) {
      localStorage.removeItem('altius-store')
      setResetStatus('Streak and recall state reset successfully. Reloading...')
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    }
  }

  return (
    <div>
      <header className="settings-header">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">Configure</span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>Settings</h1>
        <p className="font-body text-body text-mba-ink-soft prose-measure mt-3">
          Manage your personal study data, application preferences, and system storage parameters.
        </p>
      </header>

      <div className="settings-stack">
        {/* Profile Card */}
        <section className="settings-section">
          <div className="section-title-row">
            <User size={18} className="text-mba-accent" />
            <h2 className="font-display text-h3 text-mba-ink">Study Profile</h2>
          </div>
          <div className="section-body">
            <div className="profile-info font-body">
              <div className="info-row">
                <span className="label font-mono text-mono-label">Target Tier</span>
                <span className="value text-mba-ink">Tier-1 MBA Competence (IIM/ISB/XLRI)</span>
              </div>
              <div className="info-row">
                <span className="label font-mono text-mono-label">Pace</span>
                <span className="value text-mba-ink">Daily Knowledge Ritual (1 item per room)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Data admin */}
        <section className="settings-section">
          <div className="section-title-row">
            <Shield size={18} className="text-mba-accent" />
            <h2 className="font-display text-h3 text-mba-ink">Admin & Storage Controls</h2>
          </div>
          <div className="section-body font-body">
            <p className="description text-caption text-mba-ink-soft mb-4">
              Local user data is saved on this device to calculate spaced-repetition recalls and maintain streaks. Use these controls to clear cached states.
            </p>
            
            <div className="action-row">
              <button onClick={handleResetStreak} className="action-btn danger font-mono text-mono-label">
                <Trash2 size={12} className="mr-1" /> Reset Local State
              </button>
              {resetStatus && <span className="status-msg font-mono text-mono-label ml-3">{resetStatus}</span>}
            </div>
          </div>
        </section>

        {/* Help & Documentation */}
        <section className="settings-section">
          <div className="section-title-row">
            <HelpCircle size={18} className="text-mba-accent" />
            <h2 className="font-display text-h3 text-mba-ink">About Altius</h2>
          </div>
          <div className="section-body font-body">
            <p className="description text-caption text-mba-ink-soft">
              Altius is a standalone high-altitude learning platform designed for serious business leaders. It is optimized for long-session reading comfort, structural speed, and data density.
            </p>
            <div className="info-row mt-4">
              <span className="label font-mono text-mono-label">Version</span>
              <span className="value text-mba-ink">2.0.0 (Standalone Build)</span>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .settings-header {
          border-left: 3px solid var(--mba-accent); padding-left: var(--space-4); padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--mba-rule);
          margin-bottom: var(--space-6);
        }

        .settings-stack {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .settings-section {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          padding: var(--space-5);
        }

        .section-title-row {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          border-bottom: 1px solid var(--mba-rule);
          padding-bottom: var(--space-3);
          margin-bottom: var(--space-4);
        }

        .section-title-row h2 {
          font-weight: 600;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px dashed var(--mba-rule);
          padding-bottom: var(--space-2);
        }

        .info-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .info-row .label {
          color: var(--mba-ink-soft);
        }

        .info-row .value {
          font-weight: 500;
        }

        .description {
          margin: 0;
        }

        .action-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-sm);
          cursor: pointer;
          border: 1px solid var(--mba-rule);
          background: var(--mba-surface-sunk);
          color: var(--mba-ink);
          transition: all 150ms ease;
        }

        .action-btn:hover {
          background: var(--mba-accent-soft);
        }

        .action-btn.danger {
          border-color: var(--mba-danger);
          color: var(--mba-danger);
          background: transparent;
        }

        .action-btn.danger:hover {
          background: #fde8e8;
        }

        .status-msg {
          color: var(--mba-success);
        }
      `}</style>
    </div>
  )
}
