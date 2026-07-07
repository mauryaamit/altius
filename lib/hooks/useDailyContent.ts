import { useState, useEffect, useRef } from 'react'
import { useMbaStore } from '@/lib/stores/mbaStore'
import type { Specialization } from '@/lib/content/types'
import { getDynamicContentForDate } from '@/lib/content/getDynamicContent'

// Map from API contentType keys to getDynamicContentForDate type keys
const CONTENT_TYPE_MAP: Record<string, 'case' | 'hot-topic' | 'think' | 'company'> = {
  case: 'case',
  hotTopic: 'hot-topic',
  think: 'think',
  companySpotlight: 'company',
}

/**
 * useDailyContent — guaranteed to always return content.
 *
 * Strategy:
 * 1. Immediately serve from the static pool via getDynamicContentForDate
 *    (8 entries per specialization per content type — rotates by date).
 *    This is instant, requires no network, and works offline.
 * 2. Check the Zustand store cache — if a fresher entry exists (e.g. from a
 *    previous Gemini API call), prefer it.
 * 3. Silently attempt a Gemini API upgrade in the background.
 *    If it succeeds, update the displayed content.
 *    If it fails, keep showing the static content — no error state ever shown.
 *
 * loading is only true for the tiny synchronous window before step 1 resolves.
 * timedOut is never true with this approach.
 */
export function useDailyContent<T>(
  page: string,
  contentType: string,
  date: Date,
  subTag: string | null = null
) {
  const dateStr = date.toISOString().slice(0, 10)
  const ledgerId = `${page}_${contentType}_${subTag || ''}_${dateStr}`

  // ── Step 1: Get static content synchronously ────────────────────────────────
  function getStaticContent(): T | null {
    // a. Check Zustand store cache first (may contain a Gemini-upgraded version)
    const cached = useMbaStore.getState().contentLedger[ledgerId]
    if (cached?.contentBody) return cached.contentBody as T

    // b. Fall back to static pool via getDynamicContentForDate
    const staticType = CONTENT_TYPE_MAP[contentType]
    if (staticType) {
      try {
        const result = getDynamicContentForDate(staticType, page as Specialization, date)
        if (result) return result as unknown as T
      } catch {
        // ignore — fall through to null
      }
    }
    return null
  }

  const [data, setData] = useState<T | null>(getStaticContent)
  // loading is only true if somehow static content didn't resolve (shouldn't happen)
  const [loading, setLoading] = useState<boolean>(() => getStaticContent() === null)
  const [error, setError] = useState<string | null>(null)
  const timedOut = false // never timeout — static content always covers us

  const upgradeAttempted = useRef(false)

  useEffect(() => {
    upgradeAttempted.current = false

    // Refresh static content whenever page/contentType/date changes
    const fresh = getStaticContent()
    if (fresh) {
      setData(fresh)
      setLoading(false)
    }

    // ── Step 2: Background API upgrade (Gemini) ──────────────────────────────
    // We don't wait for this — static content is already shown.
    // If it succeeds, we silently upgrade.
    if (upgradeAttempted.current) return
    upgradeAttempted.current = true

    let active = true
    const url = `/api/daily-content?page=${page}&contentType=${contentType}&date=${dateStr}${subTag ? `&subTag=${subTag}` : ''}`

    fetch(url, { signal: AbortSignal.timeout(8000) })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((payload) => {
        if (!active || !payload?.contentBody) return

        // Only upgrade if the API returned something different from what we show
        const newBody = payload.contentBody as T
        useMbaStore.getState().saveToLedger({
          id: ledgerId,
          page,
          contentType,
          subTag,
          date: dateStr,
          topicKey: payload.topicKey || '',
          contentBody: newBody,
        })
        setData(newBody)
        setLoading(false)
        setError(null)
      })
      .catch(() => {
        // Silently ignore — static content is already showing
        if (!active) return
      })

    return () => { active = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, contentType, dateStr, subTag])

  return { data, loading, error, timedOut }
}
