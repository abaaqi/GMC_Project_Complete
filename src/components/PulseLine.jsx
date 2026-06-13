import './PulseLine.css'

/**
 * Signature element: an animated "vital sign" line for the farm.
 * A chartreuse trace travels left-to-right, signalling that the
 * field is alive and being watched by the system. Used in the hero,
 * on live cards, and in the sidebar footer.
 *
 * Respects prefers-reduced-motion (handled in PulseLine.css).
 */
export default function PulseLine({ height = 40, className = '', muted = false }) {
  return (
    <div
      className={`pulseline ${muted ? 'is-muted' : ''} ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 240 40" preserveAspectRatio="none" className="pulseline-svg">
        <path
          className="pulseline-path"
          d="M0 20 H40 L48 20 L54 8 L60 32 L66 14 L72 20 H110 L116 20 L122 4 L128 36 L134 20 H180 L186 20 L192 12 L198 26 L204 20 H240"
          fill="none"
        />
      </svg>
      <span className="pulseline-dot" />
    </div>
  )
}
