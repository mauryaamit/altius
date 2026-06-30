import React from 'react'
import type { Specialization } from '@/lib/content/types'
import { marketingConcepts } from '@/lib/content/marketing'
import { financeConcepts } from '@/lib/content/finance'
import { consultingConcepts } from '@/lib/content/consulting'
import { operationsConcepts } from '@/lib/content/operations'
import { strategyConcepts } from '@/lib/content/strategy'
import { peopleConcepts } from '@/lib/content/people'
import { AltitudeBlock } from '@/components/AltitudeBlock'
import { RecallCheck } from '@/components/RecallCheck'

const conceptsMap: Record<Specialization, typeof marketingConcepts> = {
  marketing:  marketingConcepts,
  finance:    financeConcepts,
  consulting: consultingConcepts,
  operations: operationsConcepts,
  strategy:   strategyConcepts,
  people:     peopleConcepts,
}

export function ConceptsTab({ specialization }: { specialization: Specialization }) {
  const concepts = conceptsMap[specialization] || []

  return (
    <section aria-label="Concepts">
      <p className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-6">
        {concepts.length} frameworks
      </p>
      {concepts.map((concept) => (
        <div key={concept.id}>
          <div className="concept-category font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-1">
            {concept.category}
          </div>
          <h2 className="font-display text-h2-fluid text-mba-ink mb-0" style={{fontWeight: 600}}>
            {concept.title}
          </h2>
          <AltitudeBlock content={concept.altitude} id={concept.id} />
          <RecallCheck conceptId={concept.id} />
        </div>
      ))}

      <style jsx>{`
        .concept-category { margin-top: var(--space-6); }
      `}</style>
    </section>
  )
}
