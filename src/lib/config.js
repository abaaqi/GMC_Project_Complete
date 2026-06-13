/* Runtime configuration, read from Vite env vars (see .env.example).
   - VITE_API_BASE_URL : where the Phase 2 API lives
   - VITE_ENABLE_MOCK_DATA : "true" runs the app on local mock data (no backend),
     "false" makes every screen talk to the real API. */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const USE_MOCK =
  (import.meta.env.VITE_ENABLE_MOCK_DATA ?? 'true') !== 'false'
