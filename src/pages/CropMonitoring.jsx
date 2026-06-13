import { useState, useMemo } from 'react'
import Icon from '../components/icons.jsx'
import { ProgressRing, ProgressBar } from '../components/ui.jsx'
import { useResource } from '../hooks/useResource.js'
import { fields as mockFields } from '../data/mockData.js'
import './dash.css'
import './CropMonitoring.css'

const filters = [
  { key: 'all', label: 'All fields' },
  { key: 'healthy', label: 'Healthy' },
  { key: 'warn', label: 'Watch' },
  { key: 'alert', label: 'Action needed' },
]

const statusLabel = { healthy: 'Healthy', warn: 'Watch', alert: 'Action needed' }

function moistureTone(m) {
  if (m < 50) return 'warn'
  if (m < 55) return 'sprout'
  return 'health'
}

export default function CropMonitoring() {
  const { data: fields } = useResource('/fields', mockFields)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    return fields.filter((f) => {
      const matchFilter = filter === 'all' || f.status === filter
      const matchQuery =
        !query ||
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.crop.toLowerCase().includes(query.toLowerCase())
      return matchFilter && matchQuery
    })
  }, [fields, filter, query])

  const counts = useMemo(
    () => ({
      all: fields.length,
      healthy: fields.filter((f) => f.status === 'healthy').length,
      warn: fields.filter((f) => f.status === 'warn').length,
      alert: fields.filter((f) => f.status === 'alert').length,
    }),
    [fields]
  )

  return (
    <div className="page-stack crops-page">
      <div className="crops-toolbar">
        <div className="crops-filters">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`crops-filter ${filter === f.key ? 'is-active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              <span className="crops-filter-count mono">{counts[f.key]}</span>
            </button>
          ))}
        </div>
        <div className="crops-search">
          <Icon name="search" size={16} />
          <input
            type="text"
            placeholder="Search field or crop…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search fields"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="crops-empty">
          <Icon name="sprout" size={28} />
          <h3>No fields match</h3>
          <p>Try a different filter or clear your search.</p>
          <button className="btn btn-ghost btn-sm" onClick={() => { setFilter('all'); setQuery('') }}>
            Reset
          </button>
        </div>
      ) : (
        <div className="crops-grid">
          {visible.map((f) => (
            <article key={f.id} className={`crop-card status-${f.status}`}>
              <div className="crop-card-head">
                <div>
                  <h3 className="crop-card-name">{f.name}</h3>
                  <span className="crop-card-crop">
                    {f.crop} · <span className="crop-card-variety">{f.variety}</span>
                  </span>
                </div>
                <span className={`badge badge-${f.status === 'healthy' ? 'healthy' : f.status === 'warn' ? 'warn' : 'alert'}`}>
                  <span className="badge-dot" />
                  {statusLabel[f.status]}
                </span>
              </div>

              <div className="crop-card-body">
                <ProgressRing value={f.health} size={84} stroke={7} label={`${f.health}`} />
                <div className="crop-card-metrics">
                  <div className="crop-metric">
                    <span className="crop-metric-label">Health index</span>
                    <span className="crop-metric-val mono">{f.health}/100</span>
                  </div>
                  <div className="crop-metric">
                    <span className="crop-metric-label">Growth stage</span>
                    <span className="crop-metric-val">{f.stage}</span>
                  </div>
                  <div className="crop-metric">
                    <span className="crop-metric-label">Soil moisture</span>
                    <span className="crop-metric-val mono">{f.moisture}%</span>
                  </div>
                </div>
              </div>

              <div className="crop-card-progress">
                <div className="crop-card-progress-top">
                  <span>Season progress</span>
                  <span className="mono">{f.progress}%</span>
                </div>
                <ProgressBar value={f.progress} tone="health" />
              </div>

              <div className="crop-card-progress">
                <div className="crop-card-progress-top">
                  <span>Moisture vs. target</span>
                  <span className="mono">{f.moisture}%</span>
                </div>
                <ProgressBar value={f.moisture} tone={moistureTone(f.moisture)} />
              </div>

              <div className={`crop-card-action sev-${f.status}`}>
                <Icon name={f.status === 'healthy' ? 'check' : f.status === 'warn' ? 'info' : 'circle-alert'} size={15} />
                <span>{f.nextAction}</span>
              </div>

              <div className="crop-card-foot">
                <span className="crop-card-planted">
                  <Icon name="calendar" size={13} /> Planted {new Date(f.plantedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
                <button className="crop-card-link">
                  Details <Icon name="arrow-up-right" size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
