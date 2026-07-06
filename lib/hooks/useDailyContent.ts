import { useState, useEffect } from 'react'
import { useMbaStore } from '@/lib/stores/mbaStore'

export function useDailyContent<T>(
  page: string,
  contentType: string,
  date: Date,
  subTag: string | null = null
) {
  const store = useMbaStore()
  
  // Format date as YYYY-MM-DD
  const dateStr = date.toISOString().slice(0, 10)
  const ledgerId = `${page}_${contentType}_${subTag || ''}_${dateStr}`
  
  const cached = store.contentLedger[ledgerId]
  const [data, setData] = useState<T | null>(cached ? (cached.contentBody as T) : null)
  const [loading, setLoading] = useState(!cached)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const activeCached = store.contentLedger[ledgerId]
    if (activeCached) {
      setData(activeCached.contentBody as T)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const url = `/api/daily-content?page=${page}&contentType=${contentType}&date=${dateStr}${subTag ? `&subTag=${subTag}` : ''}`
    
    let active = true

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load daily content')
        return res.json()
      })
      .then((payload) => {
        if (!active) return
        
        // Save to Zustand store ledger
        store.saveToLedger({
          id: ledgerId,
          page,
          contentType,
          subTag,
          date: dateStr,
          topicKey: payload.topicKey,
          contentBody: payload.contentBody
        })

        setData(payload.contentBody as T)
        setLoading(false)
      })
      .catch((err) => {
        if (!active) return
        console.error('Failed to load daily content:', err)
        setError(err.message || 'An error occurred while loading content.')
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [page, contentType, dateStr, subTag, store])

  return { data, loading, error }
}
