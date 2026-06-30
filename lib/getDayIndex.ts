// getDayIndex — Pravah convention: maps a calendar date to a deterministic
// rotating index over a content pool, so the same date always shows the same content.
// TODO: Wire to Firestore usedTopics collection to enforce no-repeat within 30-day window — Phase 5

export function getDayIndex(poolSize: number, date: Date = new Date()): number {
  // Use days-since-epoch for a stable, date-keyed index
  const msPerDay = 86_400_000
  const dayEpoch = Math.floor(date.getTime() / msPerDay)
  return dayEpoch % poolSize
}

// Helper: format date as display string for page headers
export function formatDisplayDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Helper: ISO date string for storage keys
export function toISODate(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10)
}
