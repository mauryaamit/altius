'use client'
import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Specialization } from '@/lib/content/types'
import { TabBar } from '@/components/TabBar'
import { PageHint } from '@/components/PageHint'
import { DateNav } from '@/components/DateNav'
import { ConceptsTab } from './tabs/ConceptsTab'
import { CaseTab } from './tabs/CaseTab'
import { HotTopicTab } from './tabs/HotTopicTab'
import { CompanyTab } from './tabs/CompanyTab'
import { ThinkTab } from './tabs/ThinkTab'
import { LibraryTab } from './tabs/LibraryTab'
import { OpportunityTab } from './tabs/OpportunityTab'

const SPEC_CONFIG: Record<string, {
  label: string
  chipColor: string
  tabs: string[]
}> = {
  marketing:   { label: 'Marketing',   chipColor: 'var(--chip-marketing)',  tabs: ['concepts', 'case', 'hot-topic', 'company', 'think', 'library'] },
  finance:     { label: 'Finance',     chipColor: 'var(--chip-finance)',    tabs: ['concepts', 'case', 'hot-topic', 'company', 'think', 'library'] },
  consulting:  { label: 'Consulting',  chipColor: 'var(--chip-consulting)', tabs: ['concepts', 'case', 'hot-topic', 'company', 'think', 'library'] },
  operations:  { label: 'Operations',  chipColor: 'var(--chip-operations)', tabs: ['concepts', 'case', 'hot-topic', 'company', 'think', 'library'] },
  strategy:    { label: 'Strategy',    chipColor: 'var(--chip-strategy)',   tabs: ['concepts', 'case', 'hot-topic', 'company', 'think', 'library', 'opportunity'] },
  people:      { label: 'HR & OB',      chipColor: 'var(--chip-people)',     tabs: ['concepts', 'case', 'hot-topic', 'company', 'think', 'library'] },
}

const TAB_DEFS = [
  { id: 'concepts',    label: 'Concepts'   },
  { id: 'case',        label: 'Case'       },
  { id: 'hot-topic',   label: 'Hot Topic'  },
  { id: 'company',     label: 'Company'    },
  { id: 'think',       label: 'Think'      },
  { id: 'library',     label: 'Library'    },
  { id: 'opportunity', label: 'Opportunity' },
]

interface SpecializationClientProps {
  specialization: Specialization
}

export function SpecializationClient({ specialization }: SpecializationClientProps) {
  const searchParams = useSearchParams()
  const config = SPEC_CONFIG[specialization]
  const activeTab = searchParams.get('tab') || 'concepts'

  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const availableTabs = TAB_DEFS.filter((t) => config.tabs.includes(t.id))

  // Ensure activeTab is valid for this specialization
  const resolvedTab = config.tabs.includes(activeTab) ? activeTab : 'concepts'

  if (!mounted) {
    return (
      <div className="font-body text-caption text-mba-ink-faint p-8">
        Loading specialization...
      </div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <header className="spec-header" style={{ '--chip-color': config.chipColor } as React.CSSProperties}>
        <div className="spec-eyebrow">
          <span
            className="spec-chip-dot"
            style={{ backgroundColor: config.chipColor }}
            aria-hidden="true"
          />
          <span className="font-mono text-mono-label text-mba-ink-soft uppercase tracking-widest">
            Specialization
          </span>
        </div>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>
          {config.label}
        </h1>
      </header>

      {/* Page Hint Banner */}
      <PageHint pageId={specialization} />

      {/* Date Navigation Strip */}
      {['case', 'hot-topic', 'company', 'think'].includes(resolvedTab) && <DateNav />}

      {/* Tab bar */}
      <TabBar tabs={availableTabs} activeTab={resolvedTab} />

      {/* Tab content */}
      <div className="spec-tab-content">
        <Suspense fallback={<div className="font-body text-caption text-mba-ink-faint p-8">Loading...</div>}>
          {resolvedTab === 'concepts'    && <ConceptsTab specialization={specialization} />}
          {resolvedTab === 'case'        && <CaseTab specialization={specialization} />}
          {resolvedTab === 'hot-topic'   && <HotTopicTab specialization={specialization} />}
          {resolvedTab === 'company'     && <CompanyTab specialization={specialization} />}
          {resolvedTab === 'think'       && <ThinkTab specialization={specialization} />}
          {resolvedTab === 'library'     && <LibraryTab specialization={specialization} />}
          {resolvedTab === 'opportunity' && specialization === 'strategy' && <OpportunityTab />}
        </Suspense>
      </div>

      <style jsx>{`
        .spec-header {
          padding-bottom: var(--space-6);
          padding-left: var(--space-4);
          border-left: 3px solid var(--chip-color);
          border-bottom: 1px solid var(--mba-rule);
          margin-bottom: 0;
        }

        .spec-eyebrow {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-3);
        }

        .spec-chip-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .spec-tab-content {
          padding-top: var(--space-6);
        }
      `}</style>
    </div>
  )
}
