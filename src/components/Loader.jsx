import './Loader.css'

/** Loading indicator. `full` centers it in the viewport for route guards. */
export default function Loader({ full = false, label = 'Loading…' }) {
  return (
    <div className={`loader ${full ? 'loader-full' : ''}`} role="status" aria-live="polite">
      <span className="loader-spinner" aria-hidden="true" />
      <span className="loader-label">{label}</span>
    </div>
  )
}
