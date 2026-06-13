import { useState, useRef } from 'react'
import Icon from '../components/icons.jsx'
import { api } from '../lib/api.js'
import { USE_MOCK } from '../lib/config.js'
import { useResource } from '../hooks/useResource.js'
import { diseaseResults } from '../data/mockData.js'
import './dash.css'
import './DiseaseDetection.css'

export default function DiseaseDetection() {
  const { data: history, reload } = useResource('/scans', diseaseResults)
  const [stage, setStage] = useState('idle')
  const [fileName, setFileName] = useState('')
  const [result, setResult] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  // Scan model uses `disease`; the UI expects `name`. Keep both working.
  const scans = (history || []).map((s) => ({ ...s, name: s.name || s.disease }))

  function handleFile(file) {
    if (!file) return
    setFileName(file.name)
    setStage('preview')
  }

  async function runScan() {
    setStage('analyzing')
    if (USE_MOCK) {
      // Frontend-only simulation of the vision model.
      setTimeout(() => {
        const pick = diseaseResults[Math.floor(Math.random() * diseaseResults.length)]
        setResult(pick)
        setStage('result')
      }, 2200)
      return
    }
    try {
      const scan = await api.post('/scans', { imageName: fileName })
      setResult({ ...scan, name: scan.disease || scan.name })
      setStage('result')
      reload() // refresh history with the new scan
    } catch (err) {
      setResult({
        crop: '—',
        name: 'Scan failed',
        pathogen: '—',
        confidence: 0,
        severity: 'None',
        treatment: err.message,
      })
      setStage('result')
    }
  }

  function reset() {
    setStage('idle')
    setFileName('')
    setResult(null)
  }

  const sevClass = (s) =>
    s === 'High' ? 'alert' : s === 'Moderate' ? 'warn' : s === 'None' ? 'healthy' : 'warn'

  return (
    <div className="scan-page">
      <div className="scan-grid">
        {/* Upload / capture column */}
        <section className="panel scan-upload">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Scan a leaf</h2>
              <p className="panel-sub">Upload a clear photo of an affected leaf</p>
            </div>
            <span className="badge badge-live">
              <span className="badge-dot" /> Vision AI
            </span>
          </div>

          {stage === 'idle' && (
            <div
              className={`dropzone ${dragging ? 'is-dragging' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                handleFile(e.dataTransfer.files?.[0])
              }}
              onClick={() => inputRef.current?.click()}
            >
              <span className="dropzone-icon">
                <Icon name="image-plus" size={30} />
              </span>
              <p className="dropzone-title">Drop a leaf photo here</p>
              <p className="dropzone-sub">or click to browse · JPG, PNG up to 10MB</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          )}

          {stage === 'preview' && (
            <div className="scan-preview">
              <div className="scan-thumb">
                <Icon name="leaf" size={40} />
                <span className="scan-thumb-name mono">{fileName}</span>
              </div>
              <div className="scan-preview-actions">
                <button className="btn btn-primary btn-block" onClick={runScan}>
                  <Icon name="scan-line" size={17} /> Analyze leaf
                </button>
                <button className="btn btn-ghost btn-block" onClick={reset}>
                  Choose another
                </button>
              </div>
            </div>
          )}

          {stage === 'analyzing' && (
            <div className="scan-analyzing">
              <div className="scan-scanner">
                <Icon name="leaf" size={48} />
                <span className="scan-laser" />
              </div>
              <p className="scan-analyzing-text">Analyzing leaf structure…</p>
              <div className="scan-steps">
                <span className="scan-step is-done"><Icon name="check" size={13} /> Image received</span>
                <span className="scan-step is-active">Detecting lesions…</span>
                <span className="scan-step">Matching pathogen</span>
              </div>
            </div>
          )}

          {stage === 'result' && (
            <div className="scan-done-mini">
              <div className="scan-thumb sm">
                <Icon name="leaf" size={30} />
              </div>
              <div className="scan-done-meta">
                <span className="mono scan-done-file">{fileName}</span>
                <span className="scan-done-tag">Analysis complete</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={reset}>
                <Icon name="refresh" size={14} /> New scan
              </button>
            </div>
          )}
        </section>

        {/* Result column */}
        <section className="panel scan-result">
          {stage !== 'result' ? (
            <div className="scan-result-empty">
              <Icon name="scan-line" size={26} />
              <h3>Diagnosis appears here</h3>
              <p>Upload a leaf and run a scan to see the disease, severity, and a treatment plan.</p>
            </div>
          ) : (
            <div className="scan-report">
              <div className="scan-report-head">
                <div>
                  <span className="scan-report-crop mono">{result.crop}</span>
                  <h2 className="scan-report-name">{result.name}</h2>
                  {result.pathogen !== '—' && (
                    <span className="scan-report-pathogen">{result.pathogen}</span>
                  )}
                </div>
                <div className="scan-confidence">
                  <span className="scan-confidence-val mono">{result.confidence}%</span>
                  <span className="scan-confidence-lbl">confidence</span>
                </div>
              </div>

              <div className="scan-report-row">
                <span className="scan-report-label">Severity</span>
                <span className={`badge badge-${sevClass(result.severity)}`}>
                  <span className="badge-dot" /> {result.severity}
                </span>
              </div>

              <div className="scan-treatment">
                <h3 className="scan-treatment-title">
                  <Icon name="shield" size={16} /> Recommended action
                </h3>
                <p className="scan-treatment-text">{result.treatment}</p>
              </div>

              <div className="scan-disclaimer">
                <Icon name="info" size={14} />
                <span>AI guidance — confirm with your agronomist before large-scale spraying.</span>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Recent scans */}
      <section className="panel">
        <div className="panel-head">
          <h2 className="panel-title">Recent scans</h2>
          <span className="panel-sub">Last 7 days</span>
        </div>
        <div className="scan-history">
          {scans.map((r, i) => (
            <div key={r.id || i} className="scan-history-item">
              <span className="scan-history-icon">
                <Icon name="leaf" size={18} />
              </span>
              <div className="scan-history-meta">
                <span className="scan-history-name">{r.name}</span>
                <span className="scan-history-crop">{r.crop}</span>
              </div>
              <span className={`badge badge-${sevClass(r.severity)}`}>{r.severity}</span>
              <span className="scan-history-conf mono">{r.confidence}%</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
