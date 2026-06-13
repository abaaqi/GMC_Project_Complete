import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Loader from './Loader.jsx'

/** Gate for the dashboard: waits for the session check, then requires auth. */
export default function ProtectedRoute({ children }) {
  const { isAuthed, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loader full label="Loading your farm…" />
  if (!isAuthed) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}
