import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../lib/api.js'
import { USE_MOCK } from '../lib/config.js'
import { farmProfile } from '../data/mockData.js'

/* In mock mode we start "logged in" as the demo farmer so the dashboard is
   directly reachable, while login/logout still work for demonstration. */
const demoUser = { id: 'demo', name: farmProfile.owner, email: 'demo@mahafarm.ng', role: 'farmer' }
const demoFarm = {
  name: farmProfile.name,
  location: farmProfile.location,
  area: farmProfile.area,
  areaUnit: farmProfile.areaUnit,
  zones: farmProfile.zones,
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(USE_MOCK ? demoUser : null)
  const [farm, setFarm] = useState(USE_MOCK ? demoFarm : null)
  const [loading, setLoading] = useState(!USE_MOCK)

  // In live mode, try to restore an existing session from the cookie.
  useEffect(() => {
    if (USE_MOCK) return
    let active = true
    ;(async () => {
      try {
        const { user, farm } = await authApi.me()
        if (active) {
          setUser(user)
          setFarm(farm)
        }
      } catch {
        /* no active session */
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (email, password) => {
    if (USE_MOCK) {
      setUser(demoUser)
      setFarm(demoFarm)
      return { user: demoUser, farm: demoFarm }
    }
    const res = await authApi.login({ email, password })
    setUser(res.user)
    setFarm(res.farm)
    return res
  }, [])

  const register = useCallback(async (payload) => {
    if (USE_MOCK) {
      const u = { ...demoUser, name: payload.name, email: payload.email }
      const f = { ...demoFarm, name: payload.farmName || demoFarm.name }
      setUser(u)
      setFarm(f)
      return { user: u, farm: f }
    }
    const res = await authApi.register(payload)
    setUser(res.user)
    setFarm(res.farm)
    return res
  }, [])

  const logout = useCallback(async () => {
    if (!USE_MOCK) {
      try {
        await authApi.logout()
      } catch {
        /* ignore */
      }
    }
    setUser(null)
    setFarm(null)
  }, [])

  const loginDemo = useCallback(
    () => login('demo@mahafarm.ng', 'password123'),
    [login]
  )

  const value = {
    user,
    farm,
    loading,
    isAuthed: !!user,
    useMock: USE_MOCK,
    login,
    register,
    logout,
    loginDemo,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
