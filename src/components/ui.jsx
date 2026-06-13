import { Link } from 'react-router-dom'
import Icon from './icons.jsx'
import './ui.css'

/* --- Brand logo (wordmark + mark) --- */
export function Logo({ to = '/', dark = false, compact = false }) {
  return (
    <Link to={to} className={`logo ${dark ? 'logo-dark' : ''}`} aria-label="MahaFarm home">
      <span className="logo-mark" aria-hidden="true">
        <Icon name="leaf" size={18} strokeWidth={2.4} />
      </span>
      {!compact && (
        <span className="logo-word">
          Maha<span className="logo-word-accent">Farm</span>
        </span>
      )}
    </Link>
  )
}

/* --- Section label (eyebrow + heading + optional lede) --- */
export function SectionHeading({ eyebrow, title, lede, dark = false, align = 'left' }) {
  return (
    <header className={`section-heading align-${align}`}>
      {eyebrow && <span className={`eyebrow ${dark ? 'on-dark' : ''}`}>{eyebrow}</span>}
      <h2 className={`section-heading-title ${dark ? 'is-dark' : ''}`}>{title}</h2>
      {lede && <p className={`section-heading-lede ${dark ? 'is-dark' : ''}`}>{lede}</p>}
    </header>
  )
}

/* --- KPI stat card (dashboard) --- */
export function StatCard({ kpi }) {
  const up = kpi.trend >= 0
  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-label">{kpi.label}</span>
        <span className={`badge badge-${kpi.status} on-dark`}>
          <span className="badge-dot" />
          {kpi.status}
        </span>
      </div>
      <div className="stat-card-value mono">
        {kpi.value.toLocaleString()}
        <span className="stat-card-unit">{kpi.unit}</span>
      </div>
      <div className="stat-card-foot">
        <span className={`stat-card-trend ${up ? 'is-up' : 'is-down'}`}>
          <Icon name={up ? 'trending-up' : 'trending-down'} size={14} />
          {up ? '+' : ''}
          {kpi.trend}
          {typeof kpi.trend === 'number' && kpi.unit === '%' ? '' : ''}
        </span>
        <span className="stat-card-hint">{kpi.hint}</span>
      </div>
    </article>
  )
}

/* --- Live sensor tile --- */
export function SensorCard({ sensor }) {
  return (
    <article className={`sensor-card status-${sensor.status}`}>
      <div className="sensor-card-icon">
        <Icon name={sensor.icon} size={20} />
      </div>
      <div className="sensor-card-body">
        <span className="sensor-card-label">{sensor.label}</span>
        <span className="sensor-card-zone">{sensor.zone}</span>
      </div>
      <div className="sensor-card-read mono">
        {sensor.value}
        <span className="sensor-card-unit">{sensor.unit}</span>
      </div>
    </article>
  )
}

/* --- Circular progress ring --- */
export function ProgressRing({ value, size = 56, stroke = 5, label }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="ring-svg">
        <circle cx={size / 2} cy={size / 2} r={r} className="ring-track" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="ring-fill"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="ring-label mono">{label ?? `${value}%`}</span>
    </div>
  )
}

/* --- Thin progress bar --- */
export function ProgressBar({ value, tone = 'sprout' }) {
  return (
    <div className="pbar">
      <span className={`pbar-fill tone-${tone}`} style={{ width: `${value}%` }} />
    </div>
  )
}
