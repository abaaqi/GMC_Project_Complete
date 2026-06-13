import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api.js'
import { USE_MOCK } from '../lib/config.js'

/**
 * Read-through data hook.
 *  - Mock mode: returns the fallback immediately (app runs with no backend).
 *  - Live mode: initializes with the fallback (so the UI never sees undefined),
 *    then fetches the real data and replaces it. On error it keeps the fallback
 *    so the screen still renders, and exposes the error for optional banners.
 */
export function useResource(path, fallback) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(!USE_MOCK)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    if (USE_MOCK) {
      setData(fallback)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      setData(await api.get(path))
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
    // fallback is intentionally excluded — it's a stable mock reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  useEffect(() => {
    reload()
  }, [reload])

  return { data, loading, error, reload, source: USE_MOCK ? 'mock' : 'live' }
}
