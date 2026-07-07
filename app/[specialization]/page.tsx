import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Specialization } from '@/lib/content/types'
import { SpecializationClient } from './SpecializationClient'

const VALID_SPECS: Specialization[] = [
  'marketing', 'finance', 'consulting', 'operations', 'strategy', 'people',
]

const LABELS: Record<Specialization, string> = {
  marketing:   'Marketing',
  finance:     'Finance',
  consulting:  'Consulting',
  operations:  'Operations',
  strategy:    'Strategy',
  people:      'HR & OB',
}

export function generateStaticParams() {
  return VALID_SPECS.map((s) => ({ specialization: s }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ specialization: string }>
}): Promise<Metadata> {
  const { specialization } = await params
  const label = LABELS[specialization as Specialization] || specialization
  return {
    title: label,
    description: `MBA-calibre ${label} concepts, case studies, hot topics, and think questions for serious learners.`,
  }
}

export default async function SpecializationPage({
  params,
}: {
  params: Promise<{ specialization: string }>
}) {
  const { specialization } = await params

  if (!VALID_SPECS.includes(specialization as Specialization)) {
    notFound()
  }

  return (
    <Suspense>
      <SpecializationClient specialization={specialization as Specialization} />
    </Suspense>
  )
}
