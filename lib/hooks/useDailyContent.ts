import { useState, useEffect, useRef } from 'react'
import { useMbaStore } from '@/lib/stores/mbaStore'

export function useDailyContent<T>(
  page: string,
  contentType: string,
  date: Date,
  subTag: string | null = null
) {
  // Format date as YYYY-MM-DD
  const dateStr = date.toISOString().slice(0, 10)
  const ledgerId = `${page}_${contentType}_${subTag || ''}_${dateStr}`

  // Check cache synchronously on first render (avoids flash)
  const initialCached = useMbaStore.getState().contentLedger[ledgerId]
  const [data, setData] = useState<T | null>(
    initialCached ? (initialCached.contentBody as T) : null
  )
  const [loading, setLoading] = useState(!initialCached)
  const [error, setError] = useState<string | null>(null)
  // timedOut: true after 3 seconds with no data — triggers empty state in callers
  const [timedOut, setTimedOut] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Use getState() — NOT the reactive store ref — to avoid infinite re-render loops
    const cached = useMbaStore.getState().contentLedger[ledgerId]
    if (cached) {
      setData(cached.contentBody as T)
      setLoading(false)
      setTimedOut(false)
      return
    }

    setLoading(true)
    setError(null)
    setTimedOut(false)

    // Start a 3-second timeout — if no data by then, surface empty state
    timerRef.current = setTimeout(() => {
      setTimedOut(true)
      setLoading(false)
    }, 3000)

    const url = `/api/daily-content?page=${page}&contentType=${contentType}&date=${dateStr}${subTag ? `&subTag=${subTag}` : ''}`

    let active = true

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load daily content')
        return res.json()
      })
      .then((payload) => {
        if (!active) return
        if (timerRef.current) clearTimeout(timerRef.current)

        // Save to Zustand store ledger using getState() to avoid closure issues
        useMbaStore.getState().saveToLedger({
          id: ledgerId,
          page,
          contentType,
          subTag,
          date: dateStr,
          topicKey: payload.topicKey,
          contentBody: payload.contentBody,
        })

        setData(payload.contentBody as T)
        setLoading(false)
        setTimedOut(false)
      })
      .catch((err) => {
        if (!active) return
        if (timerRef.current) clearTimeout(timerRef.current)
        console.warn('Failed to load daily content:', err)
        setError(err.message || 'An error occurred while loading content.')
        setLoading(false)
      })

    return () => {
      active = false
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, contentType, dateStr, subTag])
  // NOTE: 'store' intentionally excluded from deps — using getState() avoids stale closure
  // and prevents infinite re-render loop caused by store object reference changing each render.

  return { data, loading, error, timedOut }
}
